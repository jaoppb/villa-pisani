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
import { PayloadAuthDto } from './dto/payload-auth.dto';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name);
	constructor(
		private readonly jwtService: JwtService,
		private readonly authService: AuthService,
		private readonly reflector: Reflector,
	) {}

	private isPublic(context: ExecutionContext): boolean {
		return this.reflector.get<boolean>('isPublic', context.getHandler());
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.isPublic(context)) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractToken(request);
		const payload = this.validateToken(token);
		if (!payload) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		const user = await this.authService.getUserFromAuthPayload(payload);
		if (!user) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		request.user = user;

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
