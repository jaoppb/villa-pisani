import { CanActivate, ExecutionContext } from '@nestjs/common';

export abstract class BaseGuard implements CanActivate {
	abstract canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
