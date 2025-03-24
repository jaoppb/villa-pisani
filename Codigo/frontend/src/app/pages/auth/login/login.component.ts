import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CustomInputComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.userService.login(this.form.value).subscribe({
      next: () => {
        console.log('Login success');
      },
      error: (err) => {
        this.form.setErrors({ loginFailed: true });
      },
    });
  }
}
