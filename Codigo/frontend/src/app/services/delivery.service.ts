import { HttpClient } from "@angular/common/http";
import { CreateDelivery, DeliveredDelivery, Delivery } from "../model/delivery.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class DeliveryService {
    constructor(private http: HttpClient) {}

    getDeliveries() {
        return this.http.get<Delivery[]>('deliveries', { observe: 'response' });
    }

    getDelivery(id: string) {
        return this.http.get<Delivery>(`deliveries/${id}`, { observe: 'response' });
    }

    createDelivery(data: CreateDelivery) {
        if (!data.apartment) {
            delete data.apartment;
        }
        else {
            data.apartment = parseInt(data.apartment.toString(), 10);
        }
        return this.http.post<Delivery>('deliveries', data, { observe: 'response' });
    }

    confirmReceipt(id: string) {
        return this.http.get<Delivery>(`deliveries/${id}/confirm`, { observe: 'response' });
    }

    confirmDelivery(id: string, data: DeliveredDelivery) {
        return this.http.post<Delivery>(`deliveries/${id}/delivered`, data, { observe: 'response' });
    }
}
