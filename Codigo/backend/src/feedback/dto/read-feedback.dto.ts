import { OmitType } from '@nestjs/swagger';
import { Feedback } from '../entity/feedback.entity';

export class ReadFeedbackDto extends OmitType(Feedback, ['user'] as const) {
	userId?: string;

	constructor(feedback: Feedback) {
		super();
		this.id = feedback.id;
		this.body = feedback.body;
		this.sentAt = feedback.sentAt;
		this.status = feedback.status;

		if (feedback.user) {
			this.userId = feedback.user.id;
		}
	}
}
