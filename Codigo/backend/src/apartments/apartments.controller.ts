import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	NotFoundException,
	Delete,
	Req,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request } from 'src/http/request';
import { SafeUserDto } from 'src/user/dto/safe-user.dto';

@Controller('apartments')
export class ApartmentsController {
	constructor(private readonly apartmentsService: ApartmentsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createApartmentDto: CreateApartmentDto) {
		return this.apartmentsService.create(createApartmentDto);
	}

	@Post(':number/inhabitants/:user-id')
	@Roles(Role.MANAGER)
	addInhabitant(
		@Param('number') number: number,
		@Param('user-id') userId: string,
	) {
		return this.apartmentsService.addInhabitant(number, userId);
	}

	@Post('invite')
	async acceptInvite(
		@Req() request: Request,
		@Body('inviteToken') inviteToken: string,
	) {
		const apartment = await this.apartmentsService.acceptInvite(
			request.user,
			inviteToken,
		);

		return {
			...apartment,
			inhabitants: apartment.inhabitants.map(
				(inhabitant) => new SafeUserDto(inhabitant),
			),
		};
	}

	@Post(':number/invite')
	@Roles(Role.MANAGER)
	inviteInhabitant(@Param('number') number: number) {
		return this.apartmentsService.inviteInhabitant(number);
	}

	@Get()
	@Roles(Role.MANAGER)
	findAll() {
		return this.apartmentsService.findAll();
	}

	@Get('self')
	findSelf(@Req() req: Request) {
		const { apartment } = req.user;

		if (!apartment) {
			throw new NotFoundException('Apartment not found');
		}

		return apartment;
	}

	@Get(':number')
	@Roles(Role.MANAGER)
	findOne(@Param('number') number: number) {
		return this.apartmentsService.findOne(number);
	}

	@Patch(':number')
	@Roles(Role.MANAGER)
	update(
		@Param('number') number: number,
		@Body() updateApartmentDto: UpdateApartmentDto,
	) {
		return this.apartmentsService.update(number, updateApartmentDto);
	}

	@Get(':number/inhabitants')
	@Roles(Role.MANAGER)
	async findInhabitants(@Param('number') number: number) {
		return (await this.apartmentsService.findInhabitants(number)).map(
			(user) => new SafeUserDto(user),
		);
	}

	@Delete(':number')
	@Roles(Role.MANAGER)
	remove(@Param('number') number: number) {
		return this.apartmentsService.remove(number);
	}

	@Delete(':number/inhabitants/:id')
	@Roles(Role.MANAGER)
	async removeInhabitant(
		@Param('number') number: number,
		@Param('id') id: string,
	) {
		const apartment = await this.apartmentsService.removeInhabitant(
			number,
			id,
		);
		return {
			...apartment,
			inhabitants: apartment.inhabitants.map(
				(inhabitant) => new SafeUserDto(inhabitant),
			),
		};
	}
}
