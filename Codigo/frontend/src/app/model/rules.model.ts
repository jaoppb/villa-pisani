export interface Rule {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface CreateRuleRequest {
    title: string;
    body: string;
}

export interface UpdateRuleRequest {
    title?: string;
    body?: string;
}
