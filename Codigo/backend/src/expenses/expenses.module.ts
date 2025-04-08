import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Tag } from './tags/entities/tag.entity';
import { ExpenseFile } from './files/entities/file.entity';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { ExpenseFilesService } from './files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
	controllers: [TagsController, ExpensesController],
	providers: [ExpensesService, ExpenseFilesService, TagsService],
	imports: [
		TypeOrmModule.forFeature([Expense, Tag, ExpenseFile]),
		MulterModule.register({
			storage: diskStorage({
				destination: './files/expenses',
				filename: (req, file, cb) => {
					cb(null, Date.now() + '-' + file.originalname);
				},
			}),
		}),
	],
})
export class ExpensesModule {}
