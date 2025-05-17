import { Module } from '@nestjs/common';
import { BillFilesService } from './files.service';
import { BillFilesController } from './files.controller';

@Module({
	controllers: [BillFilesController],
	providers: [BillFilesService],
})
export class BillFilesModule {}
