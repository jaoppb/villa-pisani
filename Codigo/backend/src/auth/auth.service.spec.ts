import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';

describe('AuthService', () => {
	let service: AuthService;

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
});
