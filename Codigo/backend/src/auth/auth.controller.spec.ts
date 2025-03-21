import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';

describe('AuthController', () => {
	let controller: AuthController;
	let passwordEncryption: PasswordEncryption;
	const name = faker.person.fullName();
	const email = faker.internet.email();
	const password = faker.internet.password();
	const mockRepository = {
		save: jest.fn(),
		findOneBy: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				EncryptionModule,
				EventEmitterModule.forRoot(),
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
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(User),
					useValue: mockRepository,
				},
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		passwordEncryption = module.get<PasswordEncryption>(PasswordEncryption);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should signup', async () => {
		jest.spyOn(mockRepository, 'save').mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: name,
			email: email,
			createAt: new Date(),
			updateAt: new Date(),
			birthDate: null,
		});

		const user = await controller.signUp({
			name: name,
			email: email,
			password: password,
		});
		expect(user).toBeDefined();
		expect(user.id).toBeDefined();
	});

	it('should login', async () => {
		jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(true);
		jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce({
			id: faker.string.uuid(),
			email: email,
			password: password,
		});

		const token = await controller.signIn({
			email: email,
			password: password,
		});
		expect(token).toBeDefined();
		expect(token.accessToken).toBeDefined();
	});
});
