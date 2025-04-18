import { Component } from '@angular/core';
import { MetaData } from '../../../services/meta-data.service';
import { AccessTokenService } from '../../../services/accessToken.service';
import { ExpenseService } from '../../../services/expense.service';
import { ModalExpensesComponent } from '../../../components/modal/modal-expenses/modal-expenses.component';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { expense } from '../../../model/expense.model';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses',
  imports: [
    ModalExpensesComponent,
    ReactiveFormsModule,
    IconsComponent,
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  form: FormGroup;
  expensesList: expense[] = [];
  openModal: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private meta: MetaData,
    private expenseService: ExpenseService,
    private fb: FormBuilder,
    private tokenService: AccessTokenService,
  ) {
    this.meta.setMetaData({
      title: 'Prestação de contas',
      description: 'Contas do comdominio',
    });
    this.form = this.fb.group({
      startDate: [null,],
      endDate: [null,],
    });
    this.isAdmin = this.tokenService.hasManager;
    this.getExpensesList();
  }

  getExpensesList() {
    this.expenseService.getAllExpenses().subscribe((res: any) => {
      this.expensesList = res.map((expense: expense) => ({
        ...expense,
        createdAt: new Date(expense.createdAt).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
    });
  }

  openExpenceModal() {
    this.openModal = true;
  }

  openFile(urlFile: string) {
    console.log(urlFile);
    this.expenseService.downloadFIle(urlFile).subscribe((res: Blob) => {
      const blob = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url + "";
      a.target = '_blank';
      a.title = 'Download';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  handleIsOpenChange(isOpen: boolean) {
    this.openModal = isOpen;
  }

  handleNewExpense(expense: expense) {
    this.expensesList.unshift(expense);
    this.expensesList = [...this.expensesList];
  }

}
