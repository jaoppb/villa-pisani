import { User } from "./user.model";

export interface Apartments {
    floor: number;
    number: number;
    owner: User
}

export interface AppartamentRequest {
    floor: number;
    number: number;
}

export interface AppartamentRequestUpdate {
    floor: number;
    number: number;
    ownerId?: string;
}

export interface InviteResponse {
    inviteToken: string;
}
