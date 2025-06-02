import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NoticeRequest, NoticeResponse } from "../model/notice.model";

@Injectable({
    providedIn: 'root',
})
export class NoticesService {
    constructor(
        private http: HttpClient,
    ) {}

    createNotice(data: NoticeRequest) {
        return this.http.post<NoticeResponse>('notices', data, { observe: 'response' });
    }

    getAllNotices() {
        return this.http.get<NoticeResponse[]>('notices', { observe: 'response' });
    }

    getUserNotices() {
        return this.http.get<NoticeResponse[]>('notices/private', { observe: 'response' });
    }

    getNoticeById(id: string) {
        return this.http.get<NoticeResponse>(`notices/${id}`, { observe: 'response' });
    }

    getNoticesByRole(role: string) {
        return this.http.get<NoticeResponse[]>(`notices/role/${role}`, { observe: 'response' });
    }

    getNoticesById(id: string) {
        return this.http.get<NoticeResponse>(`notices/${id}`, { observe: 'response' });
    }

    updateNotice(id: string, data: NoticeRequest) {
        return this.http.put<NoticeResponse>(`notices/${id}`, data, { observe: 'response' });
    }

    deleteNotice(id: string) {
        return this.http.delete(`notices/${id}`, { observe: 'response' });
    }
}
