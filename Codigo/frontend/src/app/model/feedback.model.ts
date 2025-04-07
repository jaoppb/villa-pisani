export interface feedbackRequest {
	description: string;
	anonymous: boolean;
}

export interface feedbackResponse {
	id: number;
	name: string;
	date: string;
	body: string;
}