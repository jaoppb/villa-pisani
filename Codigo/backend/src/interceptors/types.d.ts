export type Mapping<T, K> = {
	new (from: T): K;
};

export interface ClassType<T = any> {
	new (...args: any[]): T;
	constructor: (...args: any[]) => T;
}

export interface ClassModule {
	[key: string]: ClassType;
}
