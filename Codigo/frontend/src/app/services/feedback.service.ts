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

	getAllFeedback(){
		return [
			{
				id: 1,
				name: 'John Doe',
				date: "2000-03-16T00:00:00.000Z",
				body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			},
			{
				id: 2,
				name: 'Jane Smith',
				date: "2001-07-21T00:00:00.000Z",
				body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
			},
			{
				id: 3,
				name: 'Alice Johnson',
				date: "1999-11-05T00:00:00.000Z",
				body: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
			},
			{
				id: 4,
				name: 'Bob Brown',
				date: "2010-02-14T00:00:00.000Z",
				body: 'Pellentesque in ipsum id orci porta dapibus.',
			},
			{
				id: 5,
				name: 'Charlie Davis',
				date: "2015-08-30T00:00:00.000Z",
				body: 'Donec sollicitudin molestie malesuada.',
			},
			{
				id: 6,
				name: 'Emily Wilson',
				date: "2020-12-25T00:00:00.000Z",
				body: 'Quisque velit nisi, pretium ut lacinia in, elementum id enim.',
			}
		];
	}
	getUserFeedback() {
		return [
			{
				id: 1,
				name: 'John Doe',
				date: "2000-03-16T00:00:00.000Z",
				body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			},
			{
				id: 2,
				name: 'Jane Smith',
				date: "2001-07-21T00:00:00.000Z",
				body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
			},
			{
				id: 3,
				name: 'Alice Johnson',
				date: "1999-11-05T00:00:00.000Z",
				body: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
			},
			{
				id: 4,
				name: 'Bob Brown',
				date: "2010-02-14T00:00:00.000Z",
				body: 'Pellentesque in ipsum id orci porta dapibus.',
			},
			{
				id: 5,
				name: 'Charlie Davis',
				date: "2015-08-30T00:00:00.000Z",
				body: 'Donec sollicitudin molestie malesuada.',
			},
			{
				id: 6,
				name: 'Emily Wilson',
				date: "2020-12-25T00:00:00.000Z",
				body: 'Quisque velit nisi, pretium ut lacinia in, elementum id enim.',
			}
		];
		// return this.http.get('feedback', { observe: 'response' });
	}

	createFeedback(data: feedbackRequest):feedbackResponse {
		return{
			id: 1,
			name: 'John Doe',
			date: "2000-03-16T00:00:00.000Z",
			body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		}
		// return this.http.post('feedback', data, { observe: 'response' });
	}
}