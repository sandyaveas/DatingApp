import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery-9';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild("memberTabs", {static: true}) memberTab : TabsetComponent;

  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUser();

    this.route.data.subscribe(observer => {
      this.user = observer['user'];
    });

    this.route.queryParams.subscribe(params =>{
      const selectedTab = params["tab"];
      this.memberTab.tabs[selectedTab > 0 ? selectedTab: 0].active = true;
    })

    this.galleryOptions = [
      {
        width : '500px',
        height: '500px',
        imagePercent : 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for(const photo of this.user.photos){
      imageUrls.push({
        small : photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }

    return imageUrls;
  }

  // loadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(user => {
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

  selectTab(tabId: number){
    this.memberTab.tabs[tabId].active = true;
  }

}
