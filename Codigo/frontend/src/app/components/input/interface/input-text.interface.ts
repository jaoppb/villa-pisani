import { InputInterface } from "./input.interface";

export interface InputTextInterface extends InputInterface {
	onTouched(): void;
	onInput(event: Event): void;
}