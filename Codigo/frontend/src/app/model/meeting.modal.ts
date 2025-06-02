export interface Meeting {
    id: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateMeeting {
    date: Date;
}
