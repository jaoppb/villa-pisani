import { OmitType } from '@nestjs/swagger';
import { Feedback } from '../entity/feedback.entity';

export class ReadFeedbackDto extends OmitType(Feedback, ['user'] as const) {
	anonymous: boolean;
	userId?: string;

	constructor(feedback: Feedback) {
		super();
		this.id = feedback.id;
		this.body = feedback.body;
		this.sentAt = feedback.sentAt;
		this.status = feedback.status;
		this.anonymous = !feedback.user;

		if (feedback.user) {
			this.userId = feedback.user.id;
		}
	}
}
