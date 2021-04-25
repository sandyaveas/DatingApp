import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseurl = 'http://localhost:59909/api/'

  constructor(private http: HttpClient) { }

  login(model: any): Observable<any>{
    return this.http.post(this.baseurl + 'auth/login', model).pipe(map((response: any) => {
      const user = response;
      if(user){
        sessionStorage.setItem('token', user.token);
      }
    }));
  }

  register(model: any): Observable<any>{
    return this.http.post(this.baseurl + 'auth/register', model);
  }

}
