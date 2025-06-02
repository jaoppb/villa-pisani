export interface NoticeRequest {
	title: string;
	body: string;
	target: {
		type: 'apartments' | 'roles';
		roles?: string[];
		apartments?: number[];
	}
	important: boolean;
}

export interface NoticeResponse {
	title: string;
	body: string;
	target: {
		type: string;
		roles?: string[];
		apartments?: number[];
	}
	important: boolean;
	createdAt: string;
	updatedAt: string;
	author: string;
}
