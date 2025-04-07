import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { FilesController } from './files/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Tag } from './tags/entities/tag.entity';
import { File } from './files/entities/file.entity';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { FilesService } from './files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
	controllers: [TagsController, FilesController, ExpensesController],
	providers: [ExpensesService, FilesService, TagsService],
	imports: [
		TypeOrmModule.forFeature([Expense, Tag, File]),
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
