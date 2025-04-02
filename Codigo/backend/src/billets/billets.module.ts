import { Module } from '@nestjs/common';
import { BilletsService } from './billets.service';
import { BilletsController } from './billets.controller';
import { TagsModule } from './tags/tags.module';
import { FilesController } from './files/files.controller';

@Module({
	controllers: [BilletsController, FilesController],
	providers: [BilletsService],
	imports: [TagsModule],
})
export class BilletsModule {}
