import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';
import { UserService } from '../../../services/user.service';
import { MetaData } from '../../../services/meta-data.service';
import { RouterModule } from '@angular/router';
import { ApartmentService } from '../../../services/apartment.service';

@Component({
	selector: 'app-login',
	imports: [CustomInputComponent, ReactiveFormsModule, RouterModule],
	standalone: true,
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	form: FormGroup;
	inviteParam: string | null = null;


	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private apartmentService: ApartmentService,
		private meta: MetaData,
	) {
		this.meta.setMetaData({
			title: 'Login',
			description: 'Entre na sua conta',
			keywords: 'login, account, user, vila pisane',
		});
		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
		});

		const urlParams = new URLSearchParams(window.location.search);
		this.inviteParam = urlParams.get('invite');
	}

	async submit() {
		if (this.inviteParam)
			this.form.value.invite = this.inviteParam;
		this.userService.login(this.form.value).subscribe({
			next: () => {
				window.location.href = '/condominium/home';
			},
			error: (err) => {
				this.form.setErrors({ loginFailed: true });
			},
		});
	}
}
