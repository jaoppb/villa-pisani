import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';

describe('AuthController', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				EncryptionModule,
				EventEmitterModule.forRoot(),
				DatabaseModule,
				TypeOrmModule.forFeature([User]),
				JwtModule.registerAsync({
					imports: [AppConfigModule],
					inject: [AppConfigService],
					useFactory: (configService: AppConfigService) => ({
						secret: configService.JwtSecret,
						signOptions: { expiresIn: '3d' },
					}),
				}),
			],
			controllers: [AuthController],
			providers: [AuthService],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
