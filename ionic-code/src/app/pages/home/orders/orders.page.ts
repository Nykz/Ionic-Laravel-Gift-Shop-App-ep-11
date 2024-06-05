import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel, IonRow, IonCol, IonText, IonGrid } from '@ionic/angular/standalone';
import { Strings } from 'src/app/enum/strings.enum';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonGrid, IonText, IonCol, IonRow, 
    IonLabel,
    IonItem,
    IonList,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    DatePipe,
    DecimalPipe,
  ],
})
export class OrdersPage implements OnInit {

  currency = Strings.CURRENCY;
  orders: any[] = [];
  private orderService = inject(OrderService);

  constructor() {}

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    try {
      const response = await this.orderService.getOrders();
      console.log(response);
      this.orders = response?.data;
    } catch(e) {
      console.log(e);
    }
  }
}
