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

	getAllExpenses() {
		return this.http.get<expense[]>('expenses');
	}

	getAllTags() {
		return this.http.get<tag[]>('expenses/tags');
	}

	createExpense(data: expenseRequest) {
		console.log(data);
		const formData = new FormData();
		formData.append('title', data.title);
		formData.append('description', data.description);
		if (data.tagIDs.length !== 0)
			formData.append('tagIDs', JSON.stringify(data.tagIDs));
		for (const file of data.files) {
			console.log(file);
			formData.append('files', file, file.name);
		}
		return this.http
			.post<expense>(
				'expenses',
				formData,
				{ observe: 'response' }
			)
			.toPromise();
	}
}
