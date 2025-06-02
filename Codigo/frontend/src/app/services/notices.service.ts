import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { feedbackRequest, feedbackResponse } from "../model/feedback.model";

@Injectable({
    providedIn: 'root',
})
export class FeedbackService {
    constructor(
        private http: HttpClient,
    ) {}

    getAllFeedback() {
        return this.http
            .get<feedbackResponse[]>
            ('feedbacks/all',
                { observe: 'response' });
    }
    getUserFeedback() {
        return this.http.get<feedbackResponse[]>('feedbacks', { observe: 'response' });
    }

    createFeedback(data: feedbackRequest) {
        return this.http.post<feedbackResponse>('feedbacks', data, { observe: 'response' });
    }
}
