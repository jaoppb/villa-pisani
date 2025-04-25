import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Controller('floors')
export class FloorsController {
	constructor(private readonly floorsService: FloorsService) {}

	@Post()
	create(@Body() createFloorDto: CreateFloorDto) {
		return this.floorsService.create(createFloorDto);
	}

	@Get()
	findAll() {
		return this.floorsService.findAll();
	}

	@Get(':number')
	findOne(@Param('number') number: number) {
		return this.floorsService.findOne(number);
	}

	@Patch(':number')
	update(
		@Param('number') number: number,
		@Body() updateFloorDto: UpdateFloorDto,
	) {
		return this.floorsService.update(number, updateFloorDto);
	}
}
