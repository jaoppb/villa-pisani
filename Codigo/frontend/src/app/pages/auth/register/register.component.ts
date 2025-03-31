import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CustomInputComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      name: ['',[ 
        Validators.required,
        Validators.minLength(3),
      ]],
      email: ['',[ 
        Validators.required,
        Validators.email
      ]],
      birthDate: ['',[ 
        this.validateAge
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()[\]{}<>#^~`|\\:;'"?/.,+=_-])[A-Za-z\d@$!%*?&()[\]{}<>#^~`|\\:;'"?/.,+=_-]+$/)
      ]],
      passwordVerification: ['',[ 
        Validators.required
      ]],
    }, { validators: this.passwordsMatch });
  }

  private validateAge(control: any): { [key: string]: string|boolean } | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (birthDate > today) return { customError: 'Você nem nasceu' }
    if (isNaN(birthDate.getTime())) return { customError: 'Data de nascimento inválida' };
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 2 ? null : { customError: 'Você não tem idade o suficiente' };
  }

  private passwordsMatch(group: FormGroup): { [key: string]: string|boolean } | null {
    const password = group.get('password')?.value;
    const passwordVerification = group.get('passwordVerification')?.value;
    if (password !== passwordVerification) {
      group.get('passwordVerification')?.setErrors({ customError: 'As senhas não são iguais' });
      return { customError: 'As senhas não são iguais' };
    }
    return null;
  }

  submit(): void {
    this.userService.register(this.form.value).subscribe({
      next: () => {
        window.location.href = '/auth/login';
      },
      error: (err: HttpErrorResponse) => {
        this.form.setErrors({ RegisterFailed: true });
        console.log(err);
        if (err.error?.message === 'User already exists') {
          this.form.get('email')?.setErrors({ customError: 'Email ja foi cadastrado' });
        }
      },
    });
  }
}
