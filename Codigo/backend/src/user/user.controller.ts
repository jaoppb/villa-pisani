import {
	BadRequestException,
	Body,
	Controller,
	Patch,
	Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { ChangePermissionDto } from './dto/permission.dto';
import { Request } from 'src/http/request';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Patch('permissions')
	@Roles(Role.MANAGER)
	async updatePermissions(@Req() req: Request, @Body() body: ChangePermissionDto) {
		const { user } = req;
		if (user.id === body.userId && !body.roles.includes(Role.MANAGER)) {
			throw new BadRequestException(
				'You cannot remove your own manager role',
			);
		}

		return await this.userService.updateRoles(body.userId, body.roles);
	}
}
