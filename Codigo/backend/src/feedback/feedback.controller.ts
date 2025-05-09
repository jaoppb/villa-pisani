import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Body,
	Param,
	Request,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.entity';
import { Request as IRequest } from 'src/http/request';
import { ReadFeedbackDto } from './dto/read-feedback.dto';
import { Feedback } from './entity/feedback.entity';

@Controller('feedbacks')
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	// TODO try to use interceptors to map
	private _mapOne(feedback: Feedback): ReadFeedbackDto {
		return new ReadFeedbackDto(feedback);
	}

	private _mapAll(feedbacks: Feedback[]): ReadFeedbackDto[] {
		return feedbacks.map((feedback) => this._mapOne(feedback));
	}

	@Post()
	@Roles(Role.INHABITANT, Role.EMPLOYEE)
	async create(
		@Request() request: IRequest,
		@Body() createFeedbackDto: CreateFeedbackDto,
	) {
		return this._mapOne(
			await this.feedbackService.create(createFeedbackDto, request.user),
		);
	}

	@Get()
	async findAllFromUser(@Request() request: IRequest) {
		return this._mapAll(
			await this.feedbackService.findAllFromUser(request.user),
		);
	}

	// TODO add pagination
	@Get('all')
	@Roles(Role.MANAGER)
	async findAll() {
		return this._mapAll(await this.feedbackService.findAll());
	}

	// TODO verify for the user
	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this._mapOne(await this.feedbackService.findOne(id));
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	async update(
		@Param('id') id: string,
		@Body() updateFeedbackDto: UpdateFeedbackDto,
	) {
		return this._mapOne(
			await this.feedbackService.update(id, updateFeedbackDto),
		);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	async remove(@Param('id') id: string) {
		return this._mapOne(await this.feedbackService.remove(id));
	}
}
