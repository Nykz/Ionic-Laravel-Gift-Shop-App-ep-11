import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonMenuToggle,
  IonContent, IonIcon, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBack,
  arrowBackOutline,
  bagHandle,
  bagHandleOutline,
  bagHandleSharp,
  callOutline,
  documentLockOutline,
  documentLockSharp,
  homeOutline,
  homeSharp,
  informationCircleOutline,
  informationCircleSharp,
  keyOutline,
  keySharp,
  locationOutline,
  locationSharp,
  lockClosedOutline,
  logOutOutline,
  logOutSharp,
  mailOutline,
  personOutline,
  personSharp,
  remove,
  star,
  ticketOutline,
  trashOutline,
} from 'ionicons/icons';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonIcon, 
    IonContent,
    IonText,
    IonLabel,
    IonAvatar,
    IonItem,
    IonHeader,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonMenuToggle,
    NgClass,
  ],
})
export class AppComponent {

  pages = [
    { title: 'Home', url: '/home', icon: 'home', active: true },
    // { title: 'Profile', url: '/profile', icon: 'person', active: false },
    { title: 'Orders', url: '/home/orders', icon: 'bag-handle', active: false },
    // { title: 'Addresses', url: '/addresses', icon: 'location', active: false },
    // {
    //   title: 'Change Password',
    //   url: '/change-password',
    //   icon: 'key',
    //   active: false,
    // },
    {
      title: 'About Us',
      url: '/about',
      icon: 'information-circle',
      active: false,
    },
    {
      title: 'Privacy Policy',
      url: '/privacy',
      icon: 'document-lock',
      active: false,
    },
    { title: 'Sign Out', icon: 'log-out', route: true, active: false },
  ];
  token: any;
  profile: any = {};
  private platform = inject(Platform);
  private router = inject(Router);
  private auth = inject(AuthService);

  constructor() {
    this.platform.ready().then(() => {
      this.addAllIcons();
      this.auth.token.subscribe({
        next: (token) => {
          this.token = token;
          if(token) this.getProfile();
        }
      });
    });
  }

  addAllIcons() {
    addIcons({
      star,
      bagHandleOutline,
      bagHandle,
      bagHandleSharp,
      trashOutline,
      add,
      remove,
      arrowBackOutline,
      ticketOutline,
      locationOutline,
      homeOutline,
      homeSharp,
      informationCircleOutline,
      informationCircleSharp,
      documentLockOutline,
      documentLockSharp,
      logOutOutline,
      logOutSharp,
      personOutline,
      personSharp,
      locationSharp,
      keyOutline,
      keySharp,
      lockClosedOutline,
      mailOutline,
      callOutline,
      arrowBack
    });
  }

  onItemTap(page: any) {
    if(!page?.active) {
      const index = this.pages.findIndex(x => x.active);
      this.pages[index].active = false;
      page.active = true;
    }

    if(!page?.route) {
      // navigate
      this.router.navigateByUrl(page?.url);
    } else {
      this.logout();
    }
  }

  async getProfile() {
    try {
      this.profile = await this.auth.getProfile();
    } catch(e) {
      console.log(e);
    }
  }

  logout() {
    console.log('logout');
    this.auth.logout();
  }
}
