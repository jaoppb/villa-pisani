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
      title: 'Feedback',
      description: 'Feedback do comdominio',
      keywords: 'feedback, review, vila pisane',
    });
    this.isAdmin = this.tokenService.hasManager;
    this.getFeedbackList();
  }

  getFeedbackList() {
    const feedbacks = this.isAdmin 
      ? this.feedbackService.getAllFeedback() 
      : this.feedbackService.getUserFeedback();

    this.feedbackList = feedbacks.map((feedback) => ({
      ...feedback,
      date: new Date(feedback.date).toLocaleDateString('pt-BR', {
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

  handleIsOpenChange(isOpen: boolean) {
    this.openModal = isOpen;
  }
  handleNewFeedback(feedback: feedbackResponse) {
    this.feedbackList.unshift({
      ...feedback,
      date: new Date(feedback.date).toLocaleDateString('pt-BR', {
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
