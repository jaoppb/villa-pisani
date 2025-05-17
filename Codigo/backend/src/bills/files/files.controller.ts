import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { BillFilesService } from './files.service';
import { CreateBillFileDto } from './dto/create-file.dto';
import { UpdateBillFileDto } from './dto/update-file.dto';

@Controller('files')
export class BillFilesController {
	constructor(private readonly filesService: BillFilesService) {}

	@Post()
	create(@Body() createFileDto: CreateBillFileDto) {
		return this.filesService.create(createFileDto);
	}

	@Get()
	findAll() {
		return this.filesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.filesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateFileDto: UpdateBillFileDto) {
		return this.filesService.update(id, updateFileDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.filesService.remove(id);
	}
}
