import { IsString } from 'class-validator';

export class DeliveredDeliveryDto {
	@IsString()
	deliveredTo: string;
}
