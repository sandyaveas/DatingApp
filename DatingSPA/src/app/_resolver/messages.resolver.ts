import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Message } from "src/app/_models/message";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";

@Injectable()
export class MessagesResolver implements Resolve<Message[]>{
    
    pageNumber = 1;
    pageSize = 6;
    messageContainer = "Unread";

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService,
        private authService: AuthService) { 
    }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]>{
        return this.userService.getMessages(+this.authService.decodedToken.nameid, 
            this.pageNumber, this.pageSize, this.messageContainer).pipe(catchError(error =>{
            this.alertify.error('Problem retrieving messages');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }
}