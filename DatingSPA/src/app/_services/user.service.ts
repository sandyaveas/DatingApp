import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/User';
import { UserFilter } from '../_models/userFilter';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getUsers(page?, itemsPerPage?, userFilter?: UserFilter): Observable<PaginatedResult<User[]>>{
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
}
