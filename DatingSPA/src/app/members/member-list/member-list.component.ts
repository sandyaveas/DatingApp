import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService, private alertifyService: AlertifyService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUsers();

    this.route.data.subscribe(observer => {
      this.users = observer['users'];
    })
  }

  // loadUsers(){
  //   this.userService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   },error =>{
  //     this.alertifyService.error(error);
  //   })
  // }
}
