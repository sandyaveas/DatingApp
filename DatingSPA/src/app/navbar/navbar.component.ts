import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model: any = {};
  photoUrl: string= "";

  constructor(public authService: AuthService, private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
     this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login(loginForm: NgForm){

    if(loginForm.valid){
      this.authService.login(this.model).subscribe(next => {
        this.alertify.success('Logged in successfully');       

      },error =>{
        this.alertify.error(error);
      },() =>{
        this.router.navigate(['/members']);
      });
    }
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }
}
