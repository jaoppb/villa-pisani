import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request } from 'src/http/request';
import { UpdateUserDto } from './dto/update-user.dto';
import { SelfUpdateUserDto } from './dto/self-update-user.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Patch('me')
	async updateMe(@Req() req: Request, @Body() body: SelfUpdateUserDto) {
		const { user } = req;
		return await this.userService.update(user.id, body);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	async update(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() body: UpdateUserDto,
	) {
		const { user } = req;
		if (
			user.id === id &&
			body.roles &&
			!body.roles.includes(Role.MANAGER)
		) {
			throw new BadRequestException(
				'You cannot remove your own manager role',
			);
		}

		return await this.userService.update(id, body);
	}

	@Get()
	@Roles(Role.MANAGER)
	async findAll() {
		return await this.userService.findAll();
	}
}
