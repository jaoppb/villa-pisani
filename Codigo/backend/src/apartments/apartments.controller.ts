import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@Controller('apartments')
export class ApartmentsController {
	constructor(private readonly apartmentsService: ApartmentsService) {}

	@Post()
	create(@Body() createApartmentDto: CreateApartmentDto) {
		return this.apartmentsService.create(createApartmentDto);
	}

	@Get()
	findAll() {
		return this.apartmentsService.findAll();
	}

	@Get(':number')
	findOne(@Param('number') number: number) {
		return this.apartmentsService.findOne(number);
	}

	@Patch(':number')
	update(
		@Param('number') number: number,
		@Body() updateApartmentDto: UpdateApartmentDto,
	) {
		return this.apartmentsService.update(number, updateApartmentDto);
	}
}
