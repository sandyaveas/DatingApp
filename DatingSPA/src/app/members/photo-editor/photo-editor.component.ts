import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() photoUrlChange = new EventEmitter<string>();
  uploader:FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl: string = environment.apiUrl;


  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 


  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) { 
    this.hasBaseDropZoneOver = false;
  }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader(): void{
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/'+ this.authService.decodedToken.nameid + '/photos',
      authToken : 'Bearer ' + this.authService.gettoken(),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.onSuccessItem = (item, response, status, headers) =>{
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        this.photos.push(photo);
      }
    }
  }

  setMainPhoto(id : number): void{
    this.userService.setMainPhoto(+this.authService.decodedToken.nameid, id).subscribe(res => {

      this.photos.find(a=> a.isMain).isMain = false;
      var currentMainPhoto = this.photos.find(a=> a.id == id);

      currentMainPhoto.isMain = true;

      this.photoUrlChange.emit(currentMainPhoto.url);

      this.authService.changeMemberPhoto(currentMainPhoto.url);


     
      this.alertify.success('Photo is succesfully set to main.');

    }, (error)=> this.alertify.error(error));
  }

  deletePhoto(id: number): void{
    this.alertify.confirm("Are you sure you want to delete this photo", () => {
      this.userService.deletePhoto(+this.authService.decodedToken.nameid, id).subscribe(res => {

        this.photos.splice(this.photos.findIndex(a=> a.id == id), 1);
        this.alertify.success('Photo deleted succesfully');

      }, (error)=> this.alertify.error(error))
    })
  }

}
