import { Test, TestingModule } from '@nestjs/testing';
import { BilletsService } from './billets.service';

describe('BilletsService', () => {
	let service: BilletsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BilletsService],
		}).compile();

		service = module.get<BilletsService>(BilletsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
