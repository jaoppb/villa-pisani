export enum DeliveryStatus {
    RECEIVED = 'received',
    DELIVERED = 'delivered',
    CONFIRMED = 'confirmed',
}

export interface Delivery {
    id: string;
    recipient: string;
    sender: string;
    receivedAt: string;
    deliveredTo: string | null;
    deliveredAt: string | null;
    status: DeliveryStatus;
    apartment: number;
    receiver: string;
    confirmAt: string | null;
    confirmTo: string | null;
}

export interface CreateDelivery {
    sender: string;
    recipient: string;
    apartment?: number;
}

export interface DeliveredDelivery {
    DeliveredTo: string;
}

export const DeliveryStatusMap: Record<DeliveryStatus, string> = {
    [DeliveryStatus.RECEIVED]: 'Recebido',
    [DeliveryStatus.DELIVERED]: 'Entregue',
    [DeliveryStatus.CONFIRMED]: 'Confirmado'
};
