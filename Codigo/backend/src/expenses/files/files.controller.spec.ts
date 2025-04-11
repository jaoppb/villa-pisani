import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseFileController } from './files.controller';

describe('FilesController', () => {
	let controller: ExpenseFileController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ExpenseFileController],
		}).compile();

		controller = module.get<ExpenseFileController>(ExpenseFileController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
