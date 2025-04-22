import { ControlValueAccessor } from '@angular/forms';

export interface InputInterface<T = string> extends ControlValueAccessor {
	type: string;
	value: T;
	id: string;

	writeValue(value: T): void;
	registerOnChange(fn: (value: T) => void): void;
	registerOnTouched(fn: () => void): void;
	setDisabledState?(isDisabled: boolean): void;

	onChange(value: T): void;
	onBlur(value: T): void;
}
