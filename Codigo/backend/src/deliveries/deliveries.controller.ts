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
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Request } from 'src/http/request';
import { Role } from 'src/auth/roles/role.entity';
import { Roles } from 'src/auth/roles/role.decorator';
import { DeliveredDeliveryDto } from './dto/delivered-delivery.dto';

@Controller('deliveries')
export class DeliveriesController {
	constructor(private readonly deliveriesService: DeliveriesService) {}

	@Post()
	@Roles(Role.MANAGER, Role.EMPLOYEE)
	create(@Req() req: Request, @Body() createDeliveryDto: CreateDeliveryDto) {
		return this.deliveriesService.create(req.user, createDeliveryDto);
	}

	@Get()
	@Roles(Role.MANAGER, Role.EMPLOYEE)
	findAll() {
		return this.deliveriesService.findAll();
	}

	// TODO: ta funcionado de um jeito diferente, arrumar depois
	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: Request) {
		const user = req.user;
		if (
			user.roles.includes(Role.MANAGER) ||
			user.roles.includes(Role.EMPLOYEE)
		) {
			return this.deliveriesService.findOne(id);
		} else {
			return this.deliveriesService.findOneInhabitant(id, user);
		}
	}

	@Post(':id/delivered')
	@Roles(Role.MANAGER, Role.EMPLOYEE)
	delivered(@Param('id') id: string, @Body() dto: DeliveredDeliveryDto) {
		return this.deliveriesService.markDelivered(id, dto);
	}

	@Get(':id/confirm')
	@Roles(Role.INHABITANT)
	confirm(@Param('id') id: string, @Req() req: Request) {
		return this.deliveriesService.confirmDelivery(id, req.user);
	}

	// @Patch(':id')
	// update(
	// 	@Param('id') id: string,
	// 	@Body() updateDeliveryDto: UpdateDeliveryDto,
	// ) {
	// 	return this.deliveriesService.update(+id, updateDeliveryDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.deliveriesService.remove(+id);
	// }
}
