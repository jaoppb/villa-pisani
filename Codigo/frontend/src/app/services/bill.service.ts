import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Bill, BillCreate } from "../model/bill.model";

@Injectable({
    providedIn: 'root',
})
export class BillService {
    constructor(
        private http: HttpClient,
    ) {}

    getAllBills() {
        return this.http.get<Bill[]>('bills');
    }

    createBill(data: BillCreate) {
        return this.http.post<Bill>('bills', data, { observe: 'response' });
    }

    getBillUserBills() {
        return this.http.get<Bill[]>('bills/private');
    }

    getBillById(id: string) {
        return this.http.get<Bill>(`bills/${id}`);
    }

    deleteBill(id: string) {
        return this.http.delete(`bills/${id}`);
    }
}
