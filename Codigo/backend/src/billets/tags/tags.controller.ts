import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('billets/tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto);
	}

	@Get()
	findAll() {
		return this.tagsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.tagsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
		return this.tagsService.update(id, updateTagDto);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.tagsService.remove(id);
	}
}
