import { IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateDeliveryDto {
	@IsString()
	sender: string;

	@IsString()
	recipient: string;

	@IsPositive()
	@IsOptional()
	apartment?: number;
}
