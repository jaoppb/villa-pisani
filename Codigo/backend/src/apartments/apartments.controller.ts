import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('apartments')
export class ApartmentsController {
	constructor(private readonly apartmentsService: ApartmentsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createApartmentDto: CreateApartmentDto) {
		return this.apartmentsService.create(createApartmentDto);
	}

	@Get()
	@Roles(Role.MANAGER)
	findAll() {
		return this.apartmentsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.apartmentsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(
		@Param('id') id: number,
		@Body() updateApartmentDto: UpdateApartmentDto,
	) {
		return this.apartmentsService.update(id, updateApartmentDto);
	}
}
