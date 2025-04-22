import { Component, forwardRef, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputInterface } from '../interface/input.interface';
import { IconsComponent } from '../../icons/iconBase/icons.component';

@Component({
  selector: 'app-input[type="file"]',
  imports: [
    IconsComponent,
  ],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true,
    },
  ],
})
export class FileComponent implements InputInterface<File[]> {
  @Input() id!: string;
  @Input() name!: string;
  @Input() errors: any = null;
  @Input() touched: boolean = false;
  @Input() label: string = '';
  @Input() accept: string = '';
  @Input() multiple: boolean = false;
  type: string = 'file';
  @Input() value: File[] = [];

  files: File[] = [];
  isDragging: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  writeValue(value: File[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = (files: File[]) => {
      this.value = files;
      fn(files);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement logic to disable the file input if needed
  }

  onChange(files: File[]): void {
    this.value = files;
  }

  onTouched(): void {
    // Placeholder for onTouched logic if needed
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      const fileArray = Array.from(event.dataTransfer.files);
      this.onChange(fileArray);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const fileArray = Array.from(input.files);
      this.onChange(fileArray);
    }
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeFile(fileName: string): void {
    this.value = this.value.filter(file => file.name !== fileName);
    this.onChange(this.value);
  }
}
