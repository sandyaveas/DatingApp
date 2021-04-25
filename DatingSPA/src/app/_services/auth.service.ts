import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseurl = 'http://localhost:59909/api/'
  private jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(model: any): Observable<any>{
    return this.http.post(this.baseurl + 'auth/login', model).pipe(map((response: any) => {
      const user = response;
      if(user){
        sessionStorage.setItem('token', user.token);
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        
      }
    }));
  }

  register(model: any): Observable<any>{
    return this.http.post(this.baseurl + 'auth/register', model);
  }

  loggedIn(){
    const token = sessionStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
