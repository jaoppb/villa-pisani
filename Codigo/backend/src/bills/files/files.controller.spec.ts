import { Test, TestingModule } from '@nestjs/testing';
import { BillFilesController } from './files.controller';
import { BillFilesService } from './files.service';

describe('BillFilesController', () => {
	let controller: BillFilesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BillFilesController],
			providers: [BillFilesService],
		}).compile();

		controller = module.get<BillFilesController>(BillFilesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
