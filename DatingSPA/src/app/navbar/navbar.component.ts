import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login(loginForm: NgForm){

    if(loginForm.valid){
      this.authService.login(this.model).subscribe(next => {
        this.alertify.success('Logged in successfully');
      },error =>{
        this.alertify.error(error);
      })
    }
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout(){
    sessionStorage.removeItem('token');
    this.alertify.message('Logged out');
  }
}
