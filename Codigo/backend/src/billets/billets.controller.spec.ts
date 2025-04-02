import { Test, TestingModule } from '@nestjs/testing';
import { BilletsController } from './billets.controller';
import { BilletsService } from './billets.service';

describe('BilletsController', () => {
	let controller: BilletsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BilletsController],
			providers: [BilletsService],
		}).compile();

		controller = module.get<BilletsController>(BilletsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
