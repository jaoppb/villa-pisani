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
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name);
	constructor(
		private readonly jwtService: JwtService,
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
		if (!(await this.validateToken(token))) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}

		return true;
	}

	private async validateToken(
		token: string | null | undefined,
	): Promise<boolean> {
		if (!token) {
			return false;
		}

		try {
			await this.jwtService.verify(token);
			return true;
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
