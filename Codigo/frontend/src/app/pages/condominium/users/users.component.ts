import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MetaData } from '../../../services/meta-data.service';
import { Role, User } from '../../../model/user.model';
import { DropboxComponent } from '../../../components/dropbox/dropbox.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [DropboxComponent, IconsComponent, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  admins: User[] = [];
  residents: User[] = [];
  employees: User[] = [];

  constructor(
    private meta: MetaData,
    private userService: UserService,
  ) {
    this.meta.setMetaData({
      title: 'Usuários',
      description: 'Usuários do condomínio',
      keywords: 'usuários, condomínio, vila pisane',
    });
    this.getUsers();
  }

  async getUsers() {
    const response = await this.userService.getUser().toPromise();
    const users = response?.body as User[] || [];

    this.admins = users.filter(user => user.roles.includes(Role.MANAGER));
    this.residents = users.filter(user => user.roles.includes(Role.INHABITANT));
    this.employees = users.filter(user => user.roles.includes(Role.EMPLOYEE));
  }
}
