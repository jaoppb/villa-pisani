import { Test, TestingModule } from '@nestjs/testing';
import { BillFilesService } from './files.service';

describe('BillFilesService', () => {
	let service: BillFilesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BillFilesService],
		}).compile();

		service = module.get<BillFilesService>(BillFilesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
