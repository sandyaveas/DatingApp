import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { User } from "../_models/User";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/user.service";
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberEditResolver implements Resolve<User>{

    constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        
        return this.userService.getUser(+route.params['id']).pipe(catchError(error => {
            this.router.navigate(['/members']);
            this.alertify.error('Problem retrieving data');
            return of(null);
        }));
    }
}