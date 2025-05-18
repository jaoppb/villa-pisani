import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';

@Module({
	controllers: [BillsController],
	providers: [BillsService, BillFilesService],
})
export class BillsModule {}
