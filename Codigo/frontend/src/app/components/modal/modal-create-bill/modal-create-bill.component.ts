import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { CheckTagsComponent } from '../../input/check-tags/check-tags.component';
import { ApartmentService } from '../../../services/apartment.service';
import { CheckTag } from '../../input/types/check-tag.type';
import { BillService } from '../../../services/bill.service';

@Component({
  selector: 'app-modal-create-bill',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent, CheckTagsComponent],
  templateUrl: './modal-create-bill.component.html',
  styleUrl: './modal-create-bill.component.scss'
})
export class ModalCreateBillComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  form: FormGroup;
  apartments: CheckTag[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly apartmentService: ApartmentService,
    private readonly billService: BillService,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.form = this.fb.group({
      date: [today, [Validators.required, this.validateDate]],
      amount: [null, [Validators.required, Validators.min(1)]],
      apartment: [[], [Validators.required, Validators.min(1)]],
    });

    this.getApartments();
  }

  private validateDate(control: any): { [key: string]: string | boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { customError: 'A data não pode ser anterior a hoje.' };
    }
    return null;
  }

  getApartments() {
    this.apartmentService.getApartments().subscribe({
      next: (response) => {
        this.apartments = response.body!.map(apartment => ({
          key: apartment.number.toString(),
          label: apartment.number.toString(),
          checked: false
        }));
      },
      error: (error) => {
        console.error('Error fetching apartments:', error);
      }
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    if (!this.form.invalid) {
      this.form.disable();
      const formData = this.form.value;
      const selectedApartments = formData.apartment.map((apartment: string) => parseInt(apartment, 10));

      const billData = {
        value: parseFloat(formData.amount),
        refer: new Date(formData.date), // Converte para Date
        dueIn: 30, // Assuming a fixed dueIn of 30 days
        apartmentNumbers: selectedApartments
      };

      this.billService.createBill(billData).subscribe({
        next: (response) => {
          console.log('Bill created successfully:', response);
          this.isOpen = false;
          this.isOpenChange.emit(this.isOpen);
          this.form.enable();
        },
        error: (error) => {
          console.error('Error creating bill:', error);
          this.form.setErrors({ createBillFailed: true });
          this.form.enable();
        }
      });
    }
    else {
      this.form.enable();
      console.log('Formulário inválido:', this.form.errors);
    }
  }
}
