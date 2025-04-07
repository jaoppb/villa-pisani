import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { expense, tag } from "../model/expense.model";

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
}