import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { InputTextInterface } from '../interface/input-text.interface';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input[type="textarea"]',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent implements InputTextInterface {
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'textarea';
  @Input() value: string = '';
  @Input() errors: any = null;
  @Input() touched: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  onChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
    this.onChangeFn(this.value);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.onChange(target.value);
  }

  onTouched(): void {
    this.touched = true;
    this.onTouchedFn();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    const textarea = document.getElementById(this.id) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.disabled = isDisabled;
    }
  }

  onBlur(value: string): void {
    this.onTouched();
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.onChange(target.value);
  }
}
