
export interface Bill {
    id: string;
    externalId: string;
    value: number;
    createdAt: Date;
    dueDate: Date;
    apartment: string;
    state: 'PENDING' | 'PAID' | 'OVERDUE';
    refer: string;
}

export interface BillCreate {
    value: number;
    dueIn: number;
    apartmentNumbers: string[];
    refer: Date;
}
