import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
	imports: [EncryptionModule, TypeOrmModule.forFeature([User, Apartment])],
	controllers: [UserController],
	providers: [UserService, AppConfigService],
	exports: [UserService],
})
export class UserModule implements OnModuleInit {
	constructor(private readonly userService: UserService) {}
	async onModuleInit() {
		await this.userService.generateUsers();
	}
}
