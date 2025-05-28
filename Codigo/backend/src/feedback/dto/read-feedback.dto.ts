import { OmitType } from '@nestjs/swagger';
import { Feedback } from '../entity/feedback.entity';

export class ReadFeedbackDto extends OmitType(Feedback, ['user'] as const) {
	userName: string = 'anonymous';

	constructor(feedback: Feedback) {
		super();
		this.id = feedback.id;
		this.body = feedback.body;
		this.sentAt = feedback.sentAt;
		this.status = feedback.status;

		if (feedback.user) {
			this.userName = feedback.user.name;
		}
	}
}
