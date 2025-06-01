import { Component } from '@angular/core';
import { DropboxComponent } from '../../../components/dropbox/dropbox.component';
import { Rule } from '../../../model/rules.model';
import { RulesService } from '../../../services/rules.service';
import { ModalCreateRulesComponent } from '../../../components/modal/modal-create-rules/modal-create-rules.component';

@Component({
  selector: 'app-rules',
  imports: [DropboxComponent, ModalCreateRulesComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent {
  rules: Rule[] = []
  // Modal
  isOpenModalCreateRule: boolean = false;

  constructor(
    private rulesService: RulesService
  ) {
    this.loadRules();
  }

  openModalCreateRule() {
    this.isOpenModalCreateRule = true;
  }

  loadRules() {
    this.rulesService.getRules().subscribe({
      next: (response) => {
        this.rules = response.body || [];
      },
      error: (error) => {
        console.error('Error loading rules:', error);
      }
    });
  }

  handleNewRule(rule: Rule) {
    this.rules.push(rule);
  }
}
