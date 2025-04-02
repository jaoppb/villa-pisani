import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { BilletsService } from './billets.service';
import { CreateBilletDto } from './dto/create-billet.dto';
import { UpdateBilletDto } from './dto/update-billet.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('billets')
export class BilletsController {
	constructor(private readonly billetsService: BilletsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createBilletDto: CreateBilletDto) {
		return this.billetsService.create(createBilletDto);
	}

	// TODO we are missing the apartment entity to return the billets of an inhabitant user
	@Get()
	findAll() {
		return this.billetsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.billetsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(@Param('id') id: string, @Body() updateBilletDto: UpdateBilletDto) {
		return this.billetsService.update(id, updateBilletDto);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.billetsService.remove(id);
	}
}
