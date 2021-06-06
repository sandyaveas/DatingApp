import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/User';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DatingSPA';
  weather: any;

  private jwtHelper = new JwtHelperService();

  /**
   *
   */
  constructor(private http: HttpClient, private authService: AuthService) {
    // this.getWeather();
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(token){
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if(user){
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }    
  }

  // getWeather() {
  //   this.http.get('http://localhost:59909/api/weatherforecast').subscribe(response =>{
  //     debugger;
  //     this.weather = response;
  //   }, error => {
  //     console.error(error);
  //   })
  // }
}
