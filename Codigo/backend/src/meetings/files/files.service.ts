import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingFilesService {
	findOne(id: string) {
		return `This action returns a #${id} file`;
	}

	remove(id: string) {
		return `This action removes a #${id} file`;
	}
}
