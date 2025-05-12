import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateUserComponent } from './modal-update-user.component';

describe('ModalUpdateUserComponent', () => {
  let component: ModalUpdateUserComponent;
  let fixture: ComponentFixture<ModalUpdateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUpdateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
