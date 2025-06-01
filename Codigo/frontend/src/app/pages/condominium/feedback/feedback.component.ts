import { Component } from '@angular/core';
import { MetaData } from '../../../services/meta-data.service';
import { FeedbackService } from '../../../services/feedback.service';
import { ModalFeedbackComponent } from '../../../components/modal/modal-feedback/modal-feedback.component';
import { feedbackResponse } from '../../../model/feedback.model';
import { AccessTokenService } from '../../../services/accessToken.service';

@Component({
  selector: 'app-feedback',
  imports: [ModalFeedbackComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  feedbackList: feedbackResponse[] = [];
  openModal: boolean = false;
  isAdmin: boolean = false;
  constructor(
    private meta: MetaData,
    private feedbackService: FeedbackService,
    private tokenService: AccessTokenService,
  ) {
    this.meta.setMetaData({
      title: 'Ouvidoria',
      description: 'Feedback do comdominio',
      keywords: 'feedback, review, vila pisane',
    });
    this.isAdmin = this.tokenService.hasManager;
    this.getFeedbackList();
  }

  async getFeedbackList() {
    const response = this.isAdmin
      ? await this.feedbackService.getAllFeedback().toPromise()
      : await this.feedbackService.getUserFeedback().toPromise();

    const feedbacks = response?.body as feedbackResponse[] || [];

    this.feedbackList = feedbacks.map((feedback) => ({
      ...feedback,
      userName: feedback.userName === 'anonymous' ? 'Anônimo' : feedback.userName,
      sentAt: new Date(feedback.sentAt).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }

  openFeedbackModal() {
    this.openModal = true;
  }

  handleNewFeedback(feedback: feedbackResponse) {
    this.feedbackList.unshift({
      ...feedback,
      sentAt: new Date(feedback.sentAt).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    this.openModal = false;
  }
}
