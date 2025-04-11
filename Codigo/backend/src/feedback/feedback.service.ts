import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entity/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/user/entities/user.entity';
import { ReadFeedbackDto } from './dto/read-feedback.dto';

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(Feedback)
		private feedbackRepository: Repository<Feedback>,
	) {}

	async create(
		createFeedbackDto: CreateFeedbackDto,
		user?: User,
	): Promise<ReadFeedbackDto> {
		const feedback = this.feedbackRepository.create(createFeedbackDto);

		if (!createFeedbackDto.anonymous) {
			if (!user) throw new NotFoundException('User not found');
			feedback.user = user;
		}

		return new ReadFeedbackDto(
			await this.feedbackRepository.save(feedback),
		);
	}

	async findAll(): Promise<ReadFeedbackDto[]> {
		return (await this.feedbackRepository.find()).map(
			(feedback) => new ReadFeedbackDto(feedback),
		);
	}

	async findOne(id: string): Promise<ReadFeedbackDto> {
		const feedback = await this.feedbackRepository.findOne({
			where: { id },
		});
		if (!feedback) {
			throw new NotFoundException(`Feedback with ID ${id} not found.`);
		}
		return new ReadFeedbackDto(feedback);
	}

	async update(
		id: string,
		updateFeedbackDto: UpdateFeedbackDto,
	): Promise<ReadFeedbackDto> {
		const feedback = await this.feedbackRepository.preload({
			id: id,
			...updateFeedbackDto,
		});
		if (!feedback) {
			throw new NotFoundException('Feedback not found');
		}
		return new ReadFeedbackDto(
			await this.feedbackRepository.save(feedback),
		);
	}

	async remove(id: string): Promise<void> {
		const feedback = await this.findOne(id);
		if (!feedback) {
			throw new NotFoundException('Feedback not found');
		}
		await this.feedbackRepository.remove(feedback);
	}
}
