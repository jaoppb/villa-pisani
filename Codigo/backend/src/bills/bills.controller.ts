import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Req,
	ParseEnumPipe,
	Headers,
	RawBody,
	ParseIntPipe,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request } from 'src/http/request';
import { Month } from './entities/month.entity';
import { Public } from 'src/auth/meta/public.decorator';

@Controller('bills')
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createBillDto: CreateBillDto) {
		return this.billsService.create(createBillDto);
	}

	@Post('webhook')
	@Public()
	updateStatus(
		@RawBody() body: Buffer,
		@Headers('stripe-signature') signature: string,
	) {
		return this.billsService.handleWebhook(signature, body);
	}

	@Get()
	@Roles(Role.MANAGER)
	findAll() {
		return this.billsService.findAll();
	}

	@Get('private')
	@Roles(Role.INHABITANT)
	findSelf(
		@Req() req: Request,
		@Param('month', new ParseEnumPipe(Month)) month: Month,
		@Param('year', new ParseIntPipe())
		year: number,
	) {
		return this.billsService.findAllFromUser(req.user, [month, year]);
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
