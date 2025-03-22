import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
	let service: AuthService;
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
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(User),
					useValue: mockRepository,
				},
			],
			imports: [EncryptionModule, EventEmitterModule.forRoot()],
		}).compile();

		service = module.get<AuthService>(AuthService);
		passwordEncryption = module.get<PasswordEncryption>(PasswordEncryption);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should signup', async () => {
		jest.spyOn(mockRepository, 'save').mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: name,
			email: email,
			createAt: new Date(),
			updateAt: new Date(),
		});

		const user = await service.signUp({
			name: name,
			email: email,
			password: password,
		});
		expect(user).toBeDefined();
		expect(user.id).toBeDefined();
	});

	it('should not signup', async () => {
		jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: name,
			email: email,
			createAt: new Date(),
			updateAt: new Date(),
		});

		await expect(
			service.signUp({
				name: name,
				email: email,
				password: password,
			}),
		).rejects.toThrow(BadRequestException);
	});

	it('should login', async () => {
		jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(true);
		jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: name,
			email: email,
			password: password,
			createAt: new Date(),
			updateAt: new Date(),
		});

		const user = await service.signIn(email, password);
		expect(user).toBeDefined();
		expect(user.id).toBeDefined();
	});

	it('should not login', async () => {
		jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(false);
		jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: name,
			email: email,
			password: password,
			createAt: new Date(),
			updateAt: new Date(),
		});

		await expect(service.signIn(email, password)).rejects.toThrow(
			UnauthorizedException,
		);
	});
});
