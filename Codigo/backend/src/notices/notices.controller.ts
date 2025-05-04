import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	ParseEnumPipe,
	ParseUUIDPipe,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Role } from 'src/auth/roles/role.entity';
import { Roles } from 'src/auth/roles/role.decorator';
import { Request } from 'src/http/request';
import { ViewNoticeDto } from './dto/view-notice.dto';

@Controller('notices')
export class NoticesController {
	constructor(private readonly noticesService: NoticesService) {}

	@Post()
	@Roles(Role.MANAGER)
	async create(
		@Req() request: Request,
		@Body() createNoticeDto: CreateNoticeDto,
	) {
		return new ViewNoticeDto(
			await this.noticesService.create(request.user, createNoticeDto),
		);
	}

	@Get()
	findAll(@Req() request: Request) {
		return this.noticesService.findAllByUserRoles(request.user);
	}

	@Get('private')
	async findAllPrivate(@Req() request: Request) {
		return (await this.noticesService.findAllByUser(request.user)).map(
			(each) => new ViewNoticeDto(each),
		);
	}

	@Get('private/:user_id')
	@Roles(Role.MANAGER)
	async findAllPrivateByUserId(
		@Param('user_id', new ParseUUIDPipe()) userId: string,
	) {
		return (await this.noticesService.findAllByUserId(userId)).map(
			(each) => new ViewNoticeDto(each),
		);
	}

	@Get('role/:role')
	@Roles(Role.MANAGER)
	async findAllByRole(@Param('role', new ParseEnumPipe(Role)) role: Role) {
		return (await this.noticesService.findAllByRole(role)).map(
			(each) => new ViewNoticeDto(each),
		);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return new ViewNoticeDto(await this.noticesService.findOne(id));
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateNoticeDto: UpdateNoticeDto,
	) {
		return new ViewNoticeDto(
			await this.noticesService.update(id, updateNoticeDto),
		);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	async remove(@Param('id', new ParseUUIDPipe()) id: string) {
		return new ViewNoticeDto(await this.noticesService.remove(id));
	}
}
