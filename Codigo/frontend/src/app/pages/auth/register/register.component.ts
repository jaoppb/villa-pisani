import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';

@Component({
  selector: 'app-register',
  imports: [CustomInputComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['',[Validators.required]],
      email: [''],
      dateBirth: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      passwordVerification: [''],
    });
  }

  submit(): void {
    console.log(this.form.value);
  }
}
