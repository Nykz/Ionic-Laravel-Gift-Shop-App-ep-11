import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonInput,
  IonIcon,
  IonInputPasswordToggle,
  IonButton,
  IonText, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonSpinner, 
    IonText,
    IonButton,
    IonIcon,
    IonInput,
    IonCard,
    IonContent,
    IonInputPasswordToggle,
    RouterLink,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isLogin = false;
  private authService = inject(AuthService);

  constructor() {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.login();
  }

  login() {
    this.isLogin = true;
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .then((data) => {
        console.log(data);
        if (data?.success == 1) {
          this.authService.navigateByUrl('/home');
          this.isLogin = false;
          this.form.reset();
        } else {
          this.isLogin = false;
          this.authService.showAlert(data?.message);
        }
      })
      .catch((e) => {
        console.log(e);
        this.isLogin = false;
        this.authService.showAlert(e?.error?.message);
      });
  }
}
