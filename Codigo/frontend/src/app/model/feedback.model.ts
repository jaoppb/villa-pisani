export interface feedbackRequest {
	body: string;
	anonymous: boolean;
}

export interface feedbackResponse {
	id: number;
	userName: string;
	body: string;
	sentAt: string;
	status: string;
}
