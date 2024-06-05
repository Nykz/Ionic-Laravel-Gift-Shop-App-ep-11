import { DecimalPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonText,
  IonButton,
  IonIcon, IonButtons, IonGrid, IonSpinner } from '@ionic/angular/standalone';
import { Strings } from 'src/app/enum/strings.enum';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonGrid, IonButtons, 
    IonIcon,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonCol,
    IonRow,
    IonCard,
    IonContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    NgClass,
    DecimalPipe,
  ],
})
export class CouponsComponent implements OnInit {

  @Input() orderTotal!: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  coupons: any[] = [];
  isLoading: boolean = false;
  currency = Strings.CURRENCY;
  private apiService = inject(ApiService);
  
  constructor() {}

  ngOnInit() {
    this.getCoupons();
  }

  async getCoupons() {
    try {
      this.isLoading = true;
      const coupons: any[] = await this.apiService.getCoupons();
      if (coupons?.length > 0) {
        coupons.map((coupon) => {
          coupon.saved = this.getSavedAmount(coupon);
          return coupon;
        });
        this.coupons = [...coupons];
      }
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
      console.log(e);
    }
  }

  getSavedAmount(coupon: any) {
    let amt = 0;
    if (coupon?.minimumOrderAmount) {
      amt = this.orderTotal - coupon.minimumOrderAmount;
      if (amt < 0) return amt;
    }
    amt = coupon?.isPercentage
      ? this.orderTotal * (coupon?.discount / 100)
      : coupon?.discount;
    if (coupon?.upto_discount) {
      console.log('check amt: ', amt);
      amt = amt >= coupon.upto_discount ? coupon.upto_discount : amt;
    }
    return amt;
  }

  closeModal(data?: any) {
    this.close.emit(data);
  }
}
