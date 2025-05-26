import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { User } from '../../../model/user.model';
import { UserService } from '../../../services/user.service';
import { CheckTag } from '../../input/types/check-tag.type';
import { CheckTagsComponent } from '../../input/check-tags/check-tags.component';

@Component({
  selector: 'app-modal-update-user',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent, CheckTagsComponent],
  templateUrl: './modal-update-user.component.html',
  styleUrl: './modal-update-user.component.scss'
})
export class ModalUpdateUserComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() user!: User
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() userUpdated = new EventEmitter<User>();
  roles: CheckTag[] = [
    { key: 'manager', label: 'Sindico', checked: false },
    { key: 'inhabitant', label: 'Morador', checked: false },
    { key: 'employee', label: 'Funcionario', checked: false },
  ]
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3),]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [this.validateAge]],
      roles: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
      birthDate: this.user.birthDate
        ? new Date(this.user.birthDate).toISOString().split('T')[0]
        : null,
      roles: this.user.roles.map(role => {
        const index = this.roles.findIndex(r => r.key === role);
        if (index !== -1) {
          this.roles[index].checked = true;
        }
        return role;
      })
    });
  }

  private validateAge(control: any): { [key: string]: string | boolean } | null {
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

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    this.userService.updateUser(this.user.id, this.form.value).subscribe((res: any) => {
      this.userUpdated.emit(res.body);
      this.isOpen = false;
      this.isOpenChange.emit(this.isOpen);
    });
  }
}
