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
	BadRequestException,
	Logger,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request } from 'src/http/request';
import { SafeUserDto } from 'src/user/dto/safe-user.dto';
import { Public } from 'src/auth/meta/public.decorator';
import { AcceptInviteDto } from './dto/accept-invite-apartment-dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';

@Controller('apartments')
export class ApartmentsController {
	private readonly logger = new Logger(ApartmentsController.name);
	constructor(
		private readonly passwordEncryption: PasswordEncryption,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly apartmentsService: ApartmentsService,
		private readonly authService: AuthService,
		private readonly dataSource: DataSource,
	) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createApartmentDto: CreateApartmentDto) {
		return this.apartmentsService.create(createApartmentDto);
	}

	@Post(':number/inhabitants/:user_id')
	@Roles(Role.MANAGER)
	addInhabitant(
		@Param('number') number: number,
		@Param('user_id') userId: string,
	) {
		return this.apartmentsService.addInhabitant(number, userId);
	}

	@Post('invite')
	@Public()
	async acceptInvite(@Req() request: Request, @Body() body: AcceptInviteDto) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (request.user === undefined) {
				if (!body.signUp) {
					throw new BadRequestException('signUp field is required');
				}

				request.user = await this.authService.signUp(
					body.signUp,
					queryRunner,
				);
			}

			const apartment = await this.apartmentsService.acceptInvite(
				queryRunner,
				request.user,
				body.inviteToken,
			);

			await queryRunner.commitTransaction();

			return {
				...apartment,
				inhabitants: apartment.inhabitants.map(
					(inhabitant) => new SafeUserDto(inhabitant),
				),
			};
		} catch (error) {
			this.logger.error('Error accepting invite', error);
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
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
