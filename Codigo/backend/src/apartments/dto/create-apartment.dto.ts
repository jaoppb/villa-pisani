import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateApartmentDto {
	@IsNumber()
	@IsPositive()
	number: number;

	@IsNumber()
	@IsPositive()
	floor: number;

	@IsOptional()
	@IsUUID()
	ownerId?: string;
}
