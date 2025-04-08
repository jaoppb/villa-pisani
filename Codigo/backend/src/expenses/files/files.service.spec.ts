import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseFilesService } from './files.service';

describe('FilesService', () => {
	let service: ExpenseFilesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ExpenseFilesService],
		}).compile();

		service = module.get<ExpenseFilesService>(ExpenseFilesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
