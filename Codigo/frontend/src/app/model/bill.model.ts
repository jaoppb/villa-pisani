
export interface Bill {
    id: string;
    externalId: string;
    value: number;
    createdAt: Date;
    dueDate: Date;
}
