import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input[type="textarea"]',
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss'
})
export class TextAreaComponent {
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onBlur(value: string) {
    console.log('Textarea blurred with value:', value);
  }
}
