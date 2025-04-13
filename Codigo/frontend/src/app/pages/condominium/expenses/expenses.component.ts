import { Component } from '@angular/core';
import { MetaData } from '../../../services/meta-data.service';
import { AccessTokenService } from '../../../services/accessToken.service';
import { ExpenseService } from '../../../services/expense.service';
import { ModalExpensesComponent } from '../../../components/modal/modal-expenses/modal-expenses.component';
import { CustomInputComponent } from '../../../components/input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { expense } from '../../../model/expense.model';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';

@Component({
  selector: 'app-expenses',
  imports: [
    ModalExpensesComponent, 
    CustomInputComponent, 
    ReactiveFormsModule,
    IconsComponent
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
      startDate: [null, ],
      endDate: [null, ],
    });
    this.isAdmin = this.tokenService.hasManager;
    this.getExpensesList();
  }

  getExpensesList() {
    this.expenseService.getAllExpenses().subscribe((res: any) => {
      this.expensesList = res;
      console.log(this.expensesList);
    });
  }

  openExpenceModal() {
    this.openModal = true;
  }

  handleIsOpenChange(isOpen: boolean) {
    this.openModal = isOpen;
  }

  handleNewExpense(expense: expense) {
    this.expensesList.unshift(expense);
    this.expensesList = [...this.expensesList];
  }

}
