import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "src/app/_models/User";
import { AlertifyService } from "src/app/_services/alertify.service";
import { UserService } from "src/app/_services/user.service";

@Injectable()
export class MemberDetailResolver implements Resolve<User>{
    
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userService.getUser(+route.params['id']).pipe(catchError(error =>{
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/members']);
            return of(null);
        }));
    }
}