import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalDatePipe implements PipeTransform {
	transform(value: string | undefined | null): Date | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}

		const date = new Date(value);
		if (isNaN(date.getTime())) {
			throw new BadRequestException(`Invalid date format: ${value}`);
		}

		return date;
	}
}
