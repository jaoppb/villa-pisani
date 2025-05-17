import { Injectable } from '@nestjs/common';
import { CreateBillFileDto } from './dto/create-file.dto';
import { UpdateBillFileDto } from './dto/update-file.dto';

@Injectable()
export class BillFilesService {
	create(createFileDto: CreateBillFileDto) {
		return 'This action adds a new file';
	}

	findAll() {
		return `This action returns all files`;
	}

	findOne(id: number) {
		return `This action returns a #${id} file`;
	}

	update(id: number, updateFileDto: UpdateBillFileDto) {
		return `This action updates a #${id} file`;
	}

	remove(id: number) {
		return `This action removes a #${id} file`;
	}
}
