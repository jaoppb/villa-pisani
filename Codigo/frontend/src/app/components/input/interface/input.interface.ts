import { ControlValueAccessor } from '@angular/forms';

export interface InputInterface extends ControlValueAccessor{
	type: string;
	value: string;
	id: string;

	writeValue(value: string): void;
	registerOnChange(fn: (value: string) => void): void;
	registerOnTouched(fn: () => void): void;
	setDisabledState?(isDisabled: boolean): void;

	onChange(value: string): void;
	onBlur(value: string): void;
}