export interface tag{
	id: string;
	labe: string;
}

export interface expense{
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	tags: tag[];
	files: string[];
}