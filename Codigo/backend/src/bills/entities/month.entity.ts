export enum Month {
	JANUARY = 'january',
	FEBRUARY = 'february',
	MARCH = 'march',
	APRIL = 'april',
	MAY = 'may',
	JUNE = 'june',
	JULY = 'july',
	AUGUST = 'august',
	SEPTEMBER = 'september',
	OCTOBER = 'october',
	NOVEMBER = 'november',
	DECEMBER = 'december',
}

export function fromDate(date: Date): Month {
	const monthIndex = date.getMonth();
	return Object.values(Month)[monthIndex] as Month;
}

export function toDate(month: Month, year: number): Date {
	const monthIndex = Object.values(Month).indexOf(month);
	if (monthIndex === -1) {
		throw new Error(`Invalid month: ${month}`);
	}
	return new Date(year, monthIndex, 1);
}
