import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../_models/User';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  registerForm: FormGroup; 
  
  @Output() cancelRegister: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService, private alertify: AlertifyService, 
    private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, this.passwordMatchValue);

    this.createRegistrationForm();
  }

  createRegistrationForm(): void{
    this.registerForm = this.fb.group({      
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }, {validator : this.passwordMatchValue })
  }

  passwordMatchValue(g: FormGroup): any{
    return g.get("password").value === g.get("confirmPassword").value ? null: {'mismatch': true};
  }

  register() {
    if(this.registerForm.valid){

      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(()=>{
        this.alertify.success('Registeration successfully done');
      }, 
      error => this.alertify.error(error),
      () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        })
      });
    }

    console.log(this.registerForm.value);
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }

}
