import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraintInterface,
} from 'class-validator';

export type MatcherFunction = (value: any) => Promise<boolean> | boolean;

export interface OneOfArguments extends ValidationArguments {
	matchers: MatcherFunction[];
}

export class OneOfConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: OneOfArguments): Promise<boolean> | boolean {
		const { matchers } = args;
		if (matchers.length === 0) {
			return true;
		}

		return new Promise((resolve) => {
			void (async () => {
				for (const matcher of matchers) {
					if (await matcher(value)) {
						resolve(true);
					}
				}
			})();
		});
	}
}

export interface OneOfOptions extends ValidationOptions {
	matchers: MatcherFunction[];
}

export function OneOf(validationOptions: OneOfOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: (value: any, args: ValidationArguments) =>
				new OneOfConstraint().validate(value, {
					...args,
					matchers: validationOptions.matchers,
				}),
		});
	};
}
