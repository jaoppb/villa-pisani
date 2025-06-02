import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateMeeting, Meeting } from '../../../model/meeting.modal';
import { MeetingService } from '../../../services/meeting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { FileComponent } from '../../input/file/file.component';

@Component({
  selector: 'app-modal-create-meeting',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent, FileComponent],
  templateUrl: './modal-create-meeting.component.html',
  styleUrl: './modal-create-meeting.component.scss'
})
export class ModalCreateMeetingComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newMeeting = new EventEmitter<Meeting>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly meetingService: MeetingService
  ) {
    this.form = this.fb.group({
      date: ['', [Validators.required]],
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    if (this.form.valid) {
      const meetingData: CreateMeeting = this.form.value;
      const newMeeting = this.meetingService.addMeeting(meetingData);
      this.newMeeting.emit(newMeeting);
      this.form.reset();
      this.handleIsOpenChange(false);
    } else {
      console.error('Form is invalid:', this.form.errors);
    }
  }
}
