export interface tag {
	id: string;
	labe: string;
}

export interface fileResponse {
	id: string;
	name: string;
	url: string;
	size: number;
	type: string;
	mimetype: string;
}


export interface expense {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	tags: tag[];
	files: fileResponse[];
}

export interface expenseRequest {
	title: string;
	description: string;
	tagIDs: string[];
	files: File[];
}
