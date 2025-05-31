import {
	ArrayMinSize,
	IsArray,
	IsDate,
	IsNumber,
	IsPositive,
	Max,
	Min,
} from 'class-validator';

export class CreateBillDto {
	@IsNumber()
	@Min(5_00)
	@Max(49_999_99)
	value: number;

	@IsDate()
	refer: Date;

	@Min(0)
	@Max(60)
	dueIn: number;

	@IsArray()
	@ArrayMinSize(1)
	@IsPositive({ each: true })
	apartmentNumbers: number[];
}
