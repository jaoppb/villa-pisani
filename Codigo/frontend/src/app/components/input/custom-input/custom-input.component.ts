import { Component, forwardRef, Input } from '@angular/core';
import { InputTextInterface } from '../interface/input-text.interface';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconsComponent } from '../../icons/icons.component';

@Component({
  selector: 'app-input',
  imports: [IconsComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent implements InputTextInterface{
  @Input() id!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() errors: any = null; 
  @Input() touched: boolean = false;
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';

  writeValue(value: string): void {
    this.value = value || '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    
  }
  onChange(value: string): void {
    
  }
  onBlur(value: string): void {
    
  }
  onTouched(): void {
    this.touched = true;
  }
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    console.log(this.errors);
  }

}
