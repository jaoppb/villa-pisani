import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { InputInterface } from '../interface/input.interface';
import { CheckTag } from '../types/check-tag.type';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconsComponent } from '../../icons/iconBase/icons.component';

@Component({
  selector: 'app-input[type="tags"]',
  templateUrl: './check-tags.component.html',
  styleUrls: ['./check-tags.component.scss'],
  imports: [
    IconsComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckTagsComponent),
      multi: true,
    },
  ],
})
export class CheckTagsComponent implements InputInterface<string[]> {
  @Input() id!: string;
  @Input() name!: string;
  type: string = 'checkbox';
  @Input() value: string[] = [];
  @Input() readonly: boolean = false;
  @Input() errors: any = null;
  @Input() touched: boolean = false;
  @Input() addable: boolean = false;
  @Output() tagAdded = new EventEmitter<void>();

  private _data: CheckTag[] = [];

  @Input()
  get data(): CheckTag[] {
    return this._data;
  }

  set data(newValue: CheckTag[]) {
    this._data = newValue;
    this.updateCheckedStates();
  }

  writeValue(value: string[]): void {
    this.value = value || [];
    this.updateCheckedStates();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  onChange(value: string[]): void {
    this.value = value;
  }

  onTouched(): void {
    this.touched = true;
  }

  onBlur(value: string[]): void {
    this.touched = true;
    this.onChange(value);
  }

  toggleSelection(key: string): void {
    if (this.readonly) return;

    const index = this.value.indexOf(key);
    if (index > -1) {
      this.value.splice(index, 1);
    } else {
      this.value.push(key);
    }

    this.updateCheckedStates();
    this.onChange(this.value);
  }

  add() {
    this.tagAdded.emit();
  }

  private updateCheckedStates(): void {
    this._data = this._data.map((item) => ({
      ...item,
      checked: this.value.includes(item.key),
    }));
  }
}
