import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl+ "user");
  }

  getUser(id : number): Observable<User>{
    return this.http.get<User>(this.baseUrl+ "user/" + id);
  }

  updateUser(id: number, userToUpdate: User): Observable<any> {
    return this.http.put<any>(this.baseUrl + "user/" + id, userToUpdate);
  }

  setMainPhoto(userId: number, id: number): Observable<any>{
    return this.http.post<any>(this.baseUrl + "users/"+ userId + "/photos/" + id + "/setMain", {});
  }

  deletePhoto(userId: number, id: number): Observable<any>{
    return this.http.delete<any>(this.baseUrl + "users/"+ userId + "/photos/" + id);
  }
}
