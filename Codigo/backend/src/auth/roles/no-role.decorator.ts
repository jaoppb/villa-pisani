import { SetMetadata } from '@nestjs/common';

export const NO_ROLES_KEY = 'no-roles';
export const NoRole = () => SetMetadata(NO_ROLES_KEY, true);
