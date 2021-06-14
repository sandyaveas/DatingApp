import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
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
  pagination: Pagination;

  constructor(private userService: UserService, private alertifyService: AlertifyService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUsers();

    this.route.data.subscribe(observer => {
      this.users = observer['users'].result;
      this.pagination = observer['users'].pagination;
    })
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    },error =>{
      this.alertifyService.error(error);
    })
  }
}
