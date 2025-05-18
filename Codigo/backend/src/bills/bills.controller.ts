import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';

@Controller('bills')
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Post()
	create(@Body() createBillDto: CreateBillDto) {
		return this.billsService.create(createBillDto);
	}

	@Get()
	findAll() {
		return this.billsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.billsService.findOne(id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.billsService.remove(id);
	}
}
