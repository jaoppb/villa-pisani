import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('bills')
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createBillDto: CreateBillDto) {
		return this.billsService.create(createBillDto);
	}

	@Get()
	@Roles(Role.MANAGER)
	findAll() {
		return this.billsService.findAll();
	}

	@Get(':id')
	@Roles(Role.MANAGER)
	findOne(@Param('id') id: string) {
		return this.billsService.findOne(id);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.billsService.remove(id);
	}
}
