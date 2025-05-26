import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback } from './entity/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback])  // Registra a entidade Feedback para injeção no repositório
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService]  // Opcional, apenas se outros módulos precisarem usar o FeedbackService
})
export class FeedbackModule {}
