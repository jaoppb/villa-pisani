import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
	imports: [
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
})
export class ApartmentsModule {}
