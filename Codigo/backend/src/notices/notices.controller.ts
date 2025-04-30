import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Role } from 'src/auth/roles/role.entity';
import { Roles } from 'src/auth/roles/role.decorator';
import { Request } from 'src/http/request';

@Controller('notices')
export class NoticesController {
	constructor(private readonly noticesService: NoticesService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Req() request: Request, @Body() createNoticeDto: CreateNoticeDto) {
		return this.noticesService.create(request.user, createNoticeDto);
	}

	@Get()
	findAll() {
		return this.noticesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.noticesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
		return this.noticesService.update(+id, updateNoticeDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.noticesService.remove(+id);
	}
}
