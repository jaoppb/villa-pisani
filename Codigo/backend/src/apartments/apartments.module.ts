import { Module, OnModuleInit } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AuthModule } from 'src/auth/auth.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
	imports: [
		AuthModule,
		EncryptionModule,
		TypeOrmModule.forFeature([Apartment, User]),
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (configService: AppConfigService) => ({
				secret: configService.JwtSecret,
				signOptions: { expiresIn: '4h' },
			}),
		}),
	],
	controllers: [ApartmentsController],
	providers: [ApartmentsService],
	exports: [ApartmentsService],
})
export class ApartmentsModule implements OnModuleInit {
	constructor(private readonly apartmentsService: ApartmentsService) {}
	async onModuleInit() {
		await this.apartmentsService.generateApartments();
	}
}
