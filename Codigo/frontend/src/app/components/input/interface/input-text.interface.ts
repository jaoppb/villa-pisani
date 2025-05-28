import { InputInterface } from "./input.interface";

export interface InputTextInterface extends InputInterface {
	placeholder: string;

	onTouched(): void;
	onInput(event: Event): void;
}