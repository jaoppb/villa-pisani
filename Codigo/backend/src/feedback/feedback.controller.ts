import { Controller, Post, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/Update-Feedback.dto';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(createFeedbackDto);
    return feedback;
  }

  @Get()
  async findAll() {
    const feedbacks = await this.feedbackService.findAll();
    return feedbacks;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const feedback = await this.feedbackService.findOne(id);
    return feedback;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    const updatedFeedback = await this.feedbackService.update(id, updateFeedbackDto);
    return updatedFeedback;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.feedbackService.remove(id);
    return null;
  }
}
