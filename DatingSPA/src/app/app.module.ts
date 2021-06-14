import { NgModule, Pipe } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimeAgoPipe } from 'time-ago-pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import {routes} from './routes.routing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.intercepter';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';

//----Extended TimeAgoPipe Starts------//
@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}
//----Extended TimeAgoPipe Ends------//

export function tokenGetter(){
  return localStorage.getItem('token');
}


@NgModule({
  declarations: [						
      AppComponent,
      NavbarComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoExtendsPipe
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forRoot(routes),
    NgxGalleryModule,
    BsDatepickerModule.forRoot(),
    FileUploadModule,
    JwtModule.forRoot({
      config : {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:59909"],
        disallowedRoutes:["localhost:59909/api/auth/"]
      }
    })
  ],
  providers: [
    ErrorInterceptorProvider, 
    MemberDetailResolver, 
    MemberListResolver,
    MemberEditResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
