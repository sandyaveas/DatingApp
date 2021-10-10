import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {
  }

  canActivate(): boolean {

    if(this.authService.loggedIn()){
      return true;
    }
    
    this.alertify.error("You're not a authorized user. Please login to access any page.");
    this.router.navigate(['/home']);
  }
  
}
