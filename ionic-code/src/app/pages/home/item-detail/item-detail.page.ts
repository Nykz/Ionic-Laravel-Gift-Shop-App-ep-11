import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  NavController,
  IonContent,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel, IonText, IonFooter, IonButton, IonBadge } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  standalone: true,
  imports: [IonBadge, IonButton, IonFooter, IonText, 
    IonLabel,
    IonItem,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonHeader,
    IonContent,
    UpperCasePipe,
    RouterLink,
  ],
})
export class ItemDetailPage implements OnInit, OnDestroy {
  id!: string;
  item: any;
  server!: string;
  addToBag!: any;
  totalItems = 0;
  cartSub!: Subscription;
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private api = inject(ApiService);
  public cartService = inject(CartService);

  constructor() {}

  ngOnInit() {
    this.getItem();

    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        console.log(cart);
        this.totalItems = cart ? cart?.totalItem : 0;
      }
    });
  }

  async getItem() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if (!id || id == '0') {
      this.navCtrl.back();
      return;
    }
    this.id = id;

    // this.item = this.api.items.find((record) => record.id == id);
    // console.log(this.item);
    try {
      const data: any = await this.api.getGiftById(id);
      if(data) {
        this.server = data?.server_base_url;
        this.item = data?.data;
      }
    } catch(e) {
      console.log(e);
    }
  }

  addItem() {
    const item = { ...this.item };
    const result = this.cartService.addQuantity(item);
    this.addedText();
  }

  addedText() {
    this.addToBag = 'Added to Bag';
    setTimeout(() => {
      this.addToBag = null;
    }, 1000);
  }

  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}
