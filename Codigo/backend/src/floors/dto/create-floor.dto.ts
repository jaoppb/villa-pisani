import { IsNumber, IsPositive } from 'class-validator';

export class CreateFloorDto {
	@IsNumber()
	@IsPositive()
	number: number;
}
