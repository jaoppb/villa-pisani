import { Module } from '@nestjs/common';
import { BilletsService } from './billets.service';
import { BilletsController } from './billets.controller';
import { TagsModule } from './tags/tags.module';
import { FilesController } from './files/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billet } from './entities/billet.entity';
import { Tag } from './tags/entities/tag.entity';
import { File } from './files/entities/file.entity';

@Module({
	controllers: [BilletsController, FilesController],
	providers: [BilletsService],
	imports: [TagsModule, TypeOrmModule.forFeature([Billet, Tag, File])],
})
export class BilletsModule {}
