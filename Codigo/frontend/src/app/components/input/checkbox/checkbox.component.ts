import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputInterface } from '../interface/input.interface';

@Component({
  selector: 'app-input[type="checkbox"], app-input[type="radio"]',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent implements InputInterface {
  @Input() id!: string;
  @Input() name!: string;
  @Input() type: string = 'checkbox';
  @Input() value: string = '';
  @Input() errors: any = null; 
  @Input() touched: boolean = false;
  @Input() checked: boolean = false;
  @Input() label: string = '';
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;
  
  writeValue(value: string): void {
    this.value = value;
    this.checked = this.value === 'true';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = (value: string) => {
      this.value = value;
      this.checked = this.value === 'true';
      fn(value);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.onBlur = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.inputRef) {
      this.inputRef.nativeElement.disabled = isDisabled;
    }
  }

  onChange(value: string): void {
    this.value = value;
    this.checked = this.value === 'true';
  }

  onBlur(): void {
    // Placeholder for onBlur logic if needed
  }

  onClick(): void {
    this.inputRef.nativeElement.click();
  }
}