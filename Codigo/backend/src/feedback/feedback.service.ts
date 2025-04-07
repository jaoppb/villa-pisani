import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entity/feedback.entity';  // Caminho atualizado para a entidade
import { CreateFeedbackDto } from './dto/create-feedback.dto';  // Caminho confirmado para DTO
import { UpdateFeedbackDto } from './dto/Update-Feedback.dto';  // Caminho confirmado para DTO

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find();
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found.`);
    }
    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackRepository.preload({
      id: id,
      ...updateFeedbackDto,
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    await this.feedbackRepository.remove(feedback);
  }
}
