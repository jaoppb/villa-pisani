import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseDatePipe,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';

@Controller('meetings')
export class MeetingsController {
	constructor(private readonly meetingsService: MeetingsService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(
		@Body() createMeetingDto: CreateMeetingDto,
		@Body('date', new ParseDatePipe()) date: Date,
	) {
		return this.meetingsService.create({ ...createMeetingDto, date });
	}

	@Get()
	findAll() {
		return this.meetingsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.meetingsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(
		@Param('id') id: string,
		@Body() updateMeetingDto: UpdateMeetingDto,
		@Body('date', new ParseDatePipe({ optional: true })) date?: Date,
	) {
		return this.meetingsService.update(id, { ...updateMeetingDto, date });
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.meetingsService.remove(id);
	}
}
