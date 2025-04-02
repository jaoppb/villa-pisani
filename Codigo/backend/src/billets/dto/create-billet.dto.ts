import { IsArray, IsCurrency, IsDate } from 'class-validator';

export class CreateBilletDto {
	@IsArray()
	tags: string[];

	@IsCurrency({
		decimal_separator: ',',
		allow_negatives: false,
		symbol: 'R$',
	})
	value: string;

	@IsDate()
	dueDate: Date;
}
