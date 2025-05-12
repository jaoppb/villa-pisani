import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Apartments, InviteResponse } from "../model/apartment.model";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApartmentService {
    constructor(
        private http: HttpClient,
    ) {}

    getApartments() {
        return this.http.get('apartments', { observe: 'response' });
    }

    getApartment(id: number) {
        return this.http.get(`apartments/${id}`, { observe: 'response' });
    }

    getInhabitants(id: number) {
        return this.http.get(`apartments/${id}/inhabitants`, { observe: 'response' });
    }

    createApartment(data: Apartments) {
        return this.http.post<Apartments>('apartments', data, { observe: 'response' });
    }

    createInvite(id: number) {
        return this.http
            .post<InviteResponse>(`apartments/${id}/invite`,
                null,
                { observe: 'response' })
            .pipe(
                tap(({ body }) => body?.inviteToken)
            );
    }

    inviteUser(token: string) {
        return this.http.post('apartments/invite', { inviteToken: token }, { observe: 'response' });
    }

    updateApartment(id: number, data: Apartments) {
        return this.http.put(`apartments/${id}`, data, { observe: 'response' });
    }

    deleteApartment(id: number) {
        return this.http.delete(`apartments/${id}`, { observe: 'response' });
    }

    deleteInhabitant(id: number, inhabitantId: string) {
        return this.http.delete(`apartments/${id}/inhabitants/${inhabitantId}`, { observe: 'response' });
    }
}
