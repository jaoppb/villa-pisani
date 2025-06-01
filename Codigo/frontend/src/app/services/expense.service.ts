import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { expense, expenseRequest, tag } from "../model/expense.model";

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	constructor(
		private http: HttpClient,
	) {}

	getAllExpenses(tags: string[] = []) {
		if (tags.length !== 0) {
			let tagsUrl = tags.map((tag) => tag.toLowerCase());
			tagsUrl = tagsUrl.filter((tag) => tag !== '');

			return this.http.get<expense[]>(`expenses/by-tags/${tagsUrl.join(',')}`);
		}
		return this.http.get<expense[]>('expenses');
	}

	getAllTags() {
		return this.http.get<tag[]>('expenses/tags');
	}

	createTag(label: string) {
		return this.http.post<tag>('expenses/tags', { label });
	}

	createExpense(data: expenseRequest) {
		const formData = new FormData();
		formData.append('title', data.title);
		formData.append('description', data.description);
		for (const tagId of data.tagIDs) formData.append('tagIDs[]', tagId);
		for (const file of data.files) formData.append('files', file, file.name);

		return this.http
			.post<expense>(
				'expenses',
				formData,
				{ observe: 'response' }
			).toPromise()
	}

	downloadFIle(url: string) {
		return this.http.get(`files/${url}`, {
			responseType: 'blob',
		})
	}
}
