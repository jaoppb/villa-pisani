import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingFilesService {
	findOne(id: number) {
		return `This action returns a #${id} file`;
	}

	remove(id: number) {
		return `This action removes a #${id} file`;
	}
}
