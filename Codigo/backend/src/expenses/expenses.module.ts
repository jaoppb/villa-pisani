import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TagsModule } from './tags/tags.module';
import { FilesController } from './files/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Tag } from './tags/entities/tag.entity';
import { File } from './files/entities/file.entity';

@Module({
	controllers: [ExpensesController, FilesController],
	providers: [ExpensesService],
	imports: [TagsModule, TypeOrmModule.forFeature([Expense, Tag, File])],
})
export class ExpensesModule {}
