import { OrderService } from './../../../../services/order/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonRadio,
  IonRadioGroup,
  IonList,
  IonItem,
  NavController,
  IonLabel, IonFooter, IonButton, IonText, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { Strings } from 'src/app/enum/strings.enum';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.page.html',
  styleUrls: ['./payment-option.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonToast, IonText, IonButton, IonFooter, 
    IonLabel,
    IonItem,
    IonList,
    IonRadioGroup,
    IonRadio,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
  ],
})
export class PaymentOptionPage implements OnInit {

  order!: any;
  currency = Strings.CURRENCY;
  pay_mode!: string;
  isToastMessage = false;
  toastModal?: any;
  isLoading = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navCtrl = inject(NavController);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  constructor() {}

  ngOnInit() {
    const data = this.route.snapshot.queryParams;
    console.log(data);
    if(data['data']) {
      const order = JSON.parse(data['data']);
      if (!order) {
        this.navCtrl.back();
      }
      this.order = order;
      console.log(this.order);
    }
  }

  async placeOrder() {
    if(!this.pay_mode) {
      // use toast message
      this.isToastMessage = true;
      this.toastModal = {
        message: 'Please select a Payment option',
        color: 'danger',
      };
      return;
    }
    try {
      this.isLoading = true;
      const data = {
        ...this.order,
        payment_mode: this.pay_mode,
        payment_status: this.pay_mode == 'Cod' ? false : true,
        transaction_id: this.pay_mode == 'Cod' ? null : '1', // pass transaction_id of the payment
      };

      const response: any = await this.orderService.placeOrder(data);
      console.log(response);
      if(response?.success == 1) {
        // clear cart
        this.cartService.clearCart();
        this.isToastMessage = true;
        this.toastModal = {
          message: 'Order placed successfully',
          color: 'success',
        };

        setTimeout(() => {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }, 1000);
      }
      this.isLoading = false;
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.isToastMessage = true;
      this.toastModal = {
        message: 'Error occured! Please try again.',
        color: 'danger',
      };
    }
  }
}
