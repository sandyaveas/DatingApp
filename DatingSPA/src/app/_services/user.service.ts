import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/User';
import { UserFilter } from 'src/app/_models/userFilter';
import { Message } from 'src/app/_models/message';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getUsers(page?, itemsPerPage?, userFilter?: UserFilter, likesParam?: string): Observable<PaginatedResult<User[]>>{
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if(page && itemsPerPage){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }

    if(userFilter != null){
      params = params.append("minAge", userFilter.minAge.toString());
      params = params.append("maxAge", userFilter.maxAge.toString());
      params = params.append("gender", userFilter.gender);
      params = params.append("orderBy", userFilter.orderBy);
     
    }

    if(likesParam === "Likers"){
      params = params.append("likers", 'true');
    }
    
    if(likesParam === "Likees"){
      params = params.append("likees", 'true');
    }
    
    return this.http.get<User[]>(this.baseUrl+ "user", { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if(response.headers.get('Pagination')){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
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

  sendLike(id: number, recepientId: number): Observable<any> {
    return this.http.post<any>(this.baseUrl + "user/"+ id + "/like/" + recepientId, {});
  }


  getMessages(id: number, page?, itemsPerPage?, messageContainer?: string): Observable<PaginatedResult<Message[]>>{
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();

    params = params.append("MessageContainer", messageContainer);
    
    if(page && itemsPerPage){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
      
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
              .pipe(
                map(response => {
                  paginatedResult.result = response.body;

                  if(response.headers.get('Pagination')){
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                  }
          
                  return paginatedResult;
                })
              );
  }

  getMessageThread(id: number, recipientId: number) : Observable<Message[]>{

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message){
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  
  deleteMessage(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe();
  }
}
