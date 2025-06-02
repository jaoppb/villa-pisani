import { HttpClient } from "@angular/common/http";
import { CreateMeeting, Meeting } from "../model/meeting.modal";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class MeetingService {
    private static meetings: Meeting[] = [
        {
            id: '1',
            date: new Date('2023-10-01T10:00:00'),
            createdAt: new Date('2023-09-01T10:00:00'),
            updatedAt: new Date('2023-09-15T10:00:00'),
        },
        {
            id: '2',
            date: new Date('2023-11-05T14:00:00'),
            createdAt: new Date('2023-10-01T10:00:00'),
            updatedAt: new Date('2023-10-15T10:00:00'),
        },
        {
            id: '3',
            date: new Date('2023-12-20T09:30:00'),
            createdAt: new Date('2023-11-01T10:00:00'),
            updatedAt: new Date('2023-11-15T10:00:00'),
        },
    ];

    constructor(
        http: HttpClient,
    ) {}

    getMeetings(): Meeting[] {
        return MeetingService.meetings;
    }

    addMeeting(meeting: CreateMeeting) {
        const newId = (MeetingService.meetings.length + 1).toString();
        const newMeeting: Meeting = {
            id: newId,
            date: new Date(meeting.date),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        MeetingService.meetings.push(newMeeting);
        return newMeeting;
    }

    updateMeeting(id: string, updatedMeeting: Meeting): void {
        const index = MeetingService.meetings.findIndex(m => m.id === id);
        if (index !== -1) {
            MeetingService.meetings[index] = updatedMeeting;
        }
    }

    deleteMeeting(id: string): void {
        MeetingService.meetings = MeetingService.meetings.filter(m => m.id !== id);
    }
}
