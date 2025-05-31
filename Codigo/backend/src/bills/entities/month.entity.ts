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
