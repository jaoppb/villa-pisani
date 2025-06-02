import { Component } from '@angular/core';
import { MetaData } from '../../../services/meta-data.service';
import { AccessTokenService } from '../../../services/accessToken.service';
import { ExpenseService } from '../../../services/expense.service';
import { ModalExpensesComponent } from '../../../components/modal/modal-expenses/modal-expenses.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { expense, tag } from '../../../model/expense.model';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { CheckTagsComponent } from '../../../components/input/check-tags/check-tags.component';
import { ModalTagExpensesComponent } from '../../../components/modal/modal-tag-expenses/modal-tag-expenses.component';
import { CheckTag } from '../../../components/input/types/check-tag.type';

@Component({
  selector: 'app-expenses',
  imports: [
    ModalExpensesComponent,
    ModalTagExpensesComponent,
    ReactiveFormsModule,
    IconsComponent,
    CheckTagsComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {
  form: FormGroup;
  expensesList: expense[] = [];
  openModalCreateExpenses: boolean = false;
  openModalCreateTag: boolean = false;
  isAdmin: boolean = false;
  tags: CheckTag[] = [];

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
      tags: [[],],
    });
    this.isAdmin = this.tokenService.hasManager;
    this.getExpensesList();
    this.getTagsList();

    this.form.valueChanges.subscribe((formValue) => {
      this.updateExpensesList(formValue.tags);
    });
  }

  getTagsList() {
    this.expenseService.getAllTags().subscribe((res: any) => {
      this.tags = res.map((tag: tag) => ({
        key: tag.id,
        label: tag.label,
        checked: false
      }));
    });
  }

  getExpensesList() {
    const tags = this.form.value.tags;
    this.expenseService.getAllExpenses(tags).subscribe((res: any) => {
      this.expensesList = res.map((expense: expense) => ({
        ...expense,
        createdAt: this.formatDate(expense.createdAt)
      }));
    });
  }

  handleNewExpense(expense: expense) {
    this.expensesList = [
      { ...expense, createdAt: this.formatDate(expense.createdAt) },
      ...this.expensesList
    ];
  }

  handleNewTag(tag: tag) {
    this.tags = [
      ...this.tags,
      {
        key: tag.id,
        label: tag.label,
        checked: false
      }
    ];
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openFile(urlFile: string) {
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

  updateExpensesList(selectedTags: string[]) {
    this.getExpensesList();
    // if (selectedTags.length === 0) {
    // } else {
    //   this.expensesList = this.expensesList.filter((expense) =>
    //     expense.tags.some((tag) => selectedTags.includes(tag.id))
    //   );
    // }
  }

  openExpenseModal() {
    this.openModalCreateExpenses = true;
  }

  openTagModal() {
    this.openModalCreateTag = true;
  }
}
