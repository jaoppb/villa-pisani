import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpenseFileController } from './files/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Tag } from './tags/entities/tag.entity';
import { ExpenseFile } from './files/entities/file.entity';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { ExpenseFilesService } from './files/files.service';
import { FilesModule } from 'src/files/files.module';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
	controllers: [TagsController, ExpenseFileController, ExpensesController],
	providers: [ExpensesService, ExpenseFilesService, TagsService],
	imports: [
		TypeOrmModule.forFeature([Expense, Tag, ExpenseFile]),
		AppConfigModule,
		FilesModule,
	],
})
export class ExpensesModule {}
