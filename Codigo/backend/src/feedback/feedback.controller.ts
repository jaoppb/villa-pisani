import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Body,
	Param,
	HttpCode,
	HttpStatus,
	Request,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request as IRequest } from 'src/http/request';

@Controller('feedbacks')
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	@Post()
	async create(
		@Request() request: IRequest,
		@Body() createFeedbackDto: CreateFeedbackDto,
	) {
		return await this.feedbackService.create(
			createFeedbackDto,
			request.user,
		);
	}

	@Get()
	async findAll() {
		return await this.feedbackService.findAll();
	}

	// TODO verify for the user
	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.feedbackService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	async update(
		@Param('id') id: string,
		@Body() updateFeedbackDto: UpdateFeedbackDto,
	) {
		return await this.feedbackService.update(id, updateFeedbackDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(Role.MANAGER)
	async remove(@Param('id') id: string) {
		await this.feedbackService.remove(id);
		return null;
	}
}
