import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseDatePipe,
	UseInterceptors,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	UploadedFile,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseOptionalDatePipe } from 'src/pipes/parse-optional-date.pipe';

@Controller('meetings')
export class MeetingsController {
	private static readonly filePipe = new ParseFilePipe({
		validators: [
			new MaxFileSizeValidator({ maxSize: 200 * 1024 * 1024 }),
			new FileTypeValidator({ fileType: 'application/pdf' }),
		],
	});

	constructor(private readonly meetingsService: MeetingsService) {}

	@Post()
	@Roles(Role.MANAGER)
	@UseInterceptors(FileInterceptor('files'))
	create(
		@Body() createMeetingDto: CreateMeetingDto,
		@Body('date', new ParseDatePipe()) date: Date,
		@UploadedFile(MeetingsController.filePipe)
		file: Express.Multer.File,
	) {
		return this.meetingsService.create({ ...createMeetingDto, date }, file);
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
		@Body('date', ParseOptionalDatePipe) date?: Date,
	) {
		return this.meetingsService.update(id, { ...updateMeetingDto, date });
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.meetingsService.remove(id);
	}
}
