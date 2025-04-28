import { IsNumber, IsPositive } from 'class-validator';

export class CreateApartmentDto {
	@IsNumber()
	@IsPositive()
	number: number;

	@IsNumber()
	@IsPositive()
	floor: number;
}
