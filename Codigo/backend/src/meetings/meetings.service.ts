import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
	create(
		createMeetingDto: CreateMeetingDto,
		file: Express.Multer.File,
	) {
		return 'This action adds a new meeting';
	}

	findAll() {
		return `This action returns all meetings`;
	}

	findOne(id: string) {
		return `This action returns a #${id} meeting`;
	}

	update(id: string, updateMeetingDto: UpdateMeetingDto) {
		return `This action updates a #${id} meeting`;
	}

	remove(id: string) {
		return `This action removes a #${id} meeting`;
	}
}
