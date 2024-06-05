import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { Strings } from 'src/app/enum/strings.enum';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private storage = inject(StorageService);

  private _token = new BehaviorSubject<any>(null);

  get token() {
    return this._token.asObservable();
  }

  constructor() {}

  updateToken(token: string) {
    this._token.next(token);
  }

  async getToken() {
    let token: any = this._token.value;
    if (!token) {
      token = (await this.storage.getStorage(Strings.TOKEN)).value;
      if(token) this.updateToken(token);
    }
    return token;
  }

  setUserData(token: string) {
    this.storage.setStorage(Strings.TOKEN, token);
    this.updateToken(token);
  }

  async register(formValue: any) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(environment.serverUrl + 'signup', formValue)
      );
      console.log(response);

      //save token in local storage
      this.setUserData(response?.token);

      return response;
    } catch (e) {
      throw e;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {

      const data = {
        email,
        password,
      };
      const response = await lastValueFrom(
        this.http.post<any>(environment.serverUrl + 'login', data)
      );
      console.log(response);

      //save token in local storage
      this.setUserData(response?.token);

      return response;
    } catch (e) {
      throw e;
    }
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  async authGuard(): Promise<boolean> {
    try {
      const token = await this.getToken();
      console.log(token);
      if (!token) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getProfile() {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(environment.serverUrl + 'profile')
      );
      console.log(response);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async logout() {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(environment.serverUrl + 'logout')
      );
      console.log(response);
      this.logoutFromDevice();
    } catch (e) {
      console.log(e);
      this.logoutFromDevice();
    }
  }

  logoutFromDevice() {
    this.storage.removeStorage(Strings.TOKEN);
    this._token.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
