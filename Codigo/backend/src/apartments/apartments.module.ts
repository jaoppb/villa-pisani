import { Module, OnApplicationBootstrap } from '@nestjs/common';
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
import { EventEmitterReadinessWatcher } from '@nestjs/event-emitter';

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
export class ApartmentsModule implements OnApplicationBootstrap {
	constructor(
		private readonly apartmentsService: ApartmentsService,
		private readonly eventEmitterReadinessWatcher: EventEmitterReadinessWatcher,
	) {}
	async onApplicationBootstrap() {
		await this.eventEmitterReadinessWatcher.waitUntilReady();
		await this.apartmentsService.generateApartments();
	}
}
