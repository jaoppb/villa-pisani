import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDeliveryDto {
	@IsString()
	sender: string;

	@IsNumber()
	@IsPositive()
	apartment: number;
}
