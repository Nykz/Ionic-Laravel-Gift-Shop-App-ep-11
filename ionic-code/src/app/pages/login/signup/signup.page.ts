import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonIcon,
  NavController,
  IonInputPasswordToggle,
  IonInput, IonButton, IonText, IonFab, IonFooter, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonFooter, IonFab, IonText, IonButton, 
    IonIcon,
    IonLabel,
    IonListHeader,
    IonList,
    IonContent,
    IonInputPasswordToggle,
    IonInput,
    ReactiveFormsModule,
  ],
})
export class SignupPage implements OnInit {
  form!: FormGroup;
  isSignup = false;
  private navCtrl = inject(NavController);
  private authService = inject(AuthService);

  constructor() {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  back() {
    this.navCtrl.back()
  }

  onSubmit() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
    this.signup();
  }

  signup() {
    this.isSignup = true;
    this.authService.register(this.form.value)
    .then(data => {
      if(data?.success === 1) {
        this.authService.navigateByUrl('/home');
        this.isSignup = false;
        this.form.reset();
      } else {
        this.isSignup = false;
        this.authService.showAlert(data?.message);
      }
    })
    .catch(e => {
      console.log(e);
      this.isSignup = false;
      this.authService.showAlert(e?.error?.message);
    })
  }
}
