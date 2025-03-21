import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';

describe('AuthService', () => {
	let service: AuthService;
	const email = `test${Date.now()}@test.com`;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
			imports: [
				EncryptionModule,
				DatabaseModule,
				TypeOrmModule.forFeature([User]),
				EventEmitterModule.forRoot(),
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should signup', async () => {
		const user = await service.signUp({
			name: 'Test',
			email: email,
			password: 'AbCd1234',
		});
		expect(user).toBeDefined();
		expect(user.id).toBeDefined();
	});

	it('should login', async () => {
		const user = await service.signIn(email, 'AbCd1234');
		expect(user).toBeDefined();
		expect(user.id).toBeDefined();
	});
});
