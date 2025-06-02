import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateMeetingComponent } from './modal-create-meeting.component';

describe('ModalCreateMeetingComponent', () => {
  let component: ModalCreateMeetingComponent;
  let fixture: ComponentFixture<ModalCreateMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateMeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
