import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'src/http/request';
import { PayloadAuthDto } from '../dto/payload-auth.dto';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name);
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		private readonly userService: UserService,
		protected readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		this.logger.debug('AuthGuard');
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractToken(request);
		const payload = await this.validateToken(token);
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

	private async validateToken(
		token: string | null | undefined,
	): Promise<PayloadAuthDto | false> {
		if (!token) {
			return false;
		}

		if (!(await this.checkPasswordChange(token))) {
			return false;
		}

		try {
			return this.jwtService.verify<PayloadAuthDto>(token);
		} catch {
			return false;
		}
	}

	private async checkPasswordChange(token: string): Promise<boolean> {
		const payload = this.jwtService.decode<PayloadAuthDto>(token);

		const user = await this.userService.findOneByEmail(payload.email);
		if (!user) {
			return false;
		}

		if (payload.iat < user.lastPasswordChange.getTime() / 1000) {
			return false;
		}

		return true;
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
