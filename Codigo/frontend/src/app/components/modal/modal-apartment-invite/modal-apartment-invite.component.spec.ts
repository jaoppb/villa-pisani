import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApartmentInviteComponent } from './modal-apartment-invite.component';

describe('ModalApartmentInviteComponent', () => {
  let component: ModalApartmentInviteComponent;
  let fixture: ComponentFixture<ModalApartmentInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalApartmentInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalApartmentInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
