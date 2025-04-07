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

	async createExpense(data: expenseRequest, files: File[]) {
		const expenseResponse = await this.http
			.post<expense>(
				'expenses',
				data,
				{ observe: 'response' }
			)
			.toPromise();

		if (!expenseResponse || !expenseResponse.body) {
			throw new Error('Error creating expense');
		}

		const expense = expenseResponse.body;

		if (!files || files.length === 0) {
			return expense;
		}

		const formData = new FormData();
		files.forEach(file => formData.append('files', file));

		return this.http
			.post<expense>(
				`expenses/files/${expense.id}`,
				formData,
				{ observe: 'response' }
			)
	}
}