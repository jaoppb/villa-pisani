import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { BillFilesModule } from './files/files.module';

@Module({
	controllers: [BillsController],
	providers: [BillsService],
	imports: [BillFilesModule],
})
export class BillsModule {}
