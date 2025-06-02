import { Component } from '@angular/core';
import { AccessTokenService } from '../../../services/accessToken.service';
import { Meeting } from '../../../model/meeting.modal';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { MeetingService } from '../../../services/meeting.service';
import { ModalCreateMeetingComponent } from '../../../components/modal/modal-create-meeting/modal-create-meeting.component';

@Component({
  selector: 'app-meeting',
  imports: [IconsComponent, ModalCreateMeetingComponent],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent {
  meetings: Meeting[] = [];
  // Modal
  isOpenModalCreateMeeting: boolean = false;

  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly MeetingService: MeetingService
  ) {
    this.loadMeetings();
  }

  private loadMeetings() {
    this.meetings = this.MeetingService.getMeetings();
  }

  isAdmin(): boolean {
    return this.accessTokenService.hasManager;
  }

  formatarDataPorExtenso(data: Date): string {
    const formatted = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(data);
    const parts = formatted.split(' de ');
    if (parts.length < 3) return formatted;
    return `${parts[0]} de ${parts[1]}\n de ${parts[2]}`;
  }

  getMeetings(meeting: Meeting) {
    this.loadMeetings()
  }

  openModalCreateMeeting() {
    this.isOpenModalCreateMeeting = true;
  }
}
