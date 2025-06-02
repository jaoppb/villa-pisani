import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateRulesComponent } from './modal-create-rules.component';

describe('CreateRulesComponent', () => {
  let component: ModalCreateRulesComponent;
  let fixture: ComponentFixture<ModalCreateRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateRulesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalCreateRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
