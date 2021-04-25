import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login(loginForm: NgForm){

    if(loginForm.valid){
      this.authService.login(this.model).subscribe(next => {
        console.log('Logged in successfully');
      },error =>{
        console.error(error);
      })
    }
  }

  loggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }

  logout(){
    sessionStorage.removeItem('token');
    console.log('Logged out');
  }
}
