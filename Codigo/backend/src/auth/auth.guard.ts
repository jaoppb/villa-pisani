import {
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'src/http/request';
import { PayloadAuthDto } from './dto/payload-auth.dto';
import { AuthService } from './auth.service';
import { CheckPublic } from './meta/check-public.decorator';
import { BaseGuard } from './base.guard';

@Injectable()
export class AuthGuard extends BaseGuard {
	private readonly logger = new Logger(AuthGuard.name);
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		protected readonly reflector: Reflector,
	) {
		super();
	}

	@CheckPublic
	async canActivate(context: ExecutionContext): Promise<boolean> {
		this.logger.debug('AuthGuard');
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractToken(request);
		const payload = this.validateToken(token);
		if (!payload) {
			this.logger.debug('Invalid token');
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		const user = await this.authService.getUserFromAuthPayload(payload);
		if (!user) {
			this.logger.debug('User not found');
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		request.user = user;

		this.logger.debug('User authenticated', user);
		return true;
	}

	private validateToken(
		token: string | null | undefined,
	): PayloadAuthDto | false {
		if (!token) {
			return false;
		}

		try {
			return this.jwtService.verify<PayloadAuthDto>(token);
		} catch {
			return false;
		}
	}

	private extractToken(request: Request): string | null {
		const authHeader = request.headers.authorization?.split(' ') ?? [];
		if (authHeader.length !== 2) {
			return null;
		}

		if (authHeader[0].toLowerCase() !== 'bearer') {
			return null;
		}

		return authHeader[1];
	}
}
