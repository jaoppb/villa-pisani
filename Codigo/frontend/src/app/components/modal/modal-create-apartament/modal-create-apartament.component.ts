import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { Apartments } from '../../../model/apartment.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from '../../../services/apartment.service';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';

@Component({
  selector: 'app-modal-create-apartament',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './modal-create-apartament.component.html',
  styleUrl: './modal-create-apartament.component.scss'
})
export class ModalCreateApartamentComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newApartment = new EventEmitter<Apartments>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
  ) {
    this.form = this.fb.group({
      number: [0, [Validators.required, Validators.min(1), Validators.max(9999)]],
      floor: [0, [Validators.required, Validators.min(1), Validators.max(99)]],
    });
  }

  submit(): void {
    const data = {
      number: Number(this.form.value.number),
      floor: Number(this.form.value.floor),
    }
    this.apartmentService.createApartment(data).subscribe({
      next: (response) => {
        const body: Apartments | null = response.body;
        if (body) {
          this.newApartment.emit(body);
          this.form.reset();
          this.handleIsOpenChange(false);
        }
      },
      error: (err) => {
        this.form.setErrors({ loginFailed: true });
      },
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
}
