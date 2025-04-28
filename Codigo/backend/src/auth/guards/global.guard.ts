import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PublicGuard } from './public.guard';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

@Injectable()
export class GlobalGuard implements CanActivate {
	constructor(
		private readonly publicGuard: PublicGuard,
		private readonly authGuard: AuthGuard,
		private readonly roleGuard: RoleGuard,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (await this.publicGuard.canActivate(context)) {
			return true;
		}

		const auth = await this.authGuard.canActivate(context);
		const roles = await this.roleGuard.canActivate(context);

		return auth && roles;
	}
}
