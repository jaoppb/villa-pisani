import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entity/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(Feedback)
		private feedbackRepository: Repository<Feedback>,
	) {}

	async create(
		createFeedbackDto: CreateFeedbackDto,
		user?: User,
	): Promise<Feedback> {
		const feedback = this.feedbackRepository.create(createFeedbackDto);

		if (!createFeedbackDto.anonymous) {
			if (!user) throw new NotFoundException('User not found');
			feedback.user = user;
		}

		return this.feedbackRepository.save(feedback);
	}

	async findAll(): Promise<Feedback[]> {
		return this.feedbackRepository.find({
			order: { sentAt: 'DESC' },
		});
	}

	async findAllFromUser(user: User): Promise<Feedback[]> {
		const feedbacks = await this.feedbackRepository.find({
			where: { user: { id: user.id } },
			order: { sentAt: 'DESC' },
		});
		return feedbacks;
	}

	async findOne(id: string): Promise<Feedback> {
		const feedback = await this.feedbackRepository.findOne({
			where: { id },
		});
		if (!feedback) {
			throw new NotFoundException(`Feedback with ID ${id} not found.`);
		}
		return feedback;
	}

	async update(
		id: string,
		updateFeedbackDto: UpdateFeedbackDto,
	): Promise<Feedback> {
		const feedback = await this.feedbackRepository.preload({
			id: id,
			...updateFeedbackDto,
		});
		if (!feedback) {
			throw new NotFoundException('Feedback not found');
		}
		return await this.feedbackRepository.save(feedback);
	}

	async remove(id: string): Promise<Feedback> {
		const feedback = await this.findOne(id);
		if (!feedback) {
			throw new NotFoundException('Feedback not found');
		}
		return await this.feedbackRepository.remove(feedback);
	}
}
