import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonImg,
  IonThumbnail,
  IonText,
  IonCol,
  IonRow,
  IonListHeader,
  IonList,
  IonItemGroup,
  IonFooter,
  IonModal,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { CouponsComponent } from './components/coupons/coupons.component';
import { Strings } from 'src/app/enum/strings.enum';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { AddressService } from 'src/app/services/address/address.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonItemDivider,
    IonModal,
    IonFooter,
    IonItemGroup,
    IonList,
    IonListHeader,
    IonRow,
    IonCol,
    IonText,
    IonImg,
    IonCard,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    IonBackButton,
    IonButtons,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonThumbnail,
    DecimalPipe,
    CouponsComponent,
    AddAddressComponent,
    AddressesComponent,
  ],
})
export class CartPage implements OnInit, OnDestroy {
  @ViewChild('add_address_modal') add_address_modal!: IonModal;
  @ViewChild('address_modal') address_modal!: IonModal;
  imageBaseUrl = environment.serverImageBaseUrl;
  previous!: string;
  cartSub!: Subscription;
  selectedCoupon!: any;
  applyCoupon = false;
  isAddAddress = false;
  isSelectAddress = false;
  isCheckoutToShippingAddress = false;
  address!: any;
  model: any = null;
  currency = Strings.CURRENCY;
  addresses: any[] = [];
  addressSub!: Subscription;
  private router = inject(Router);
  public cartService = inject(CartService);
  private addressService = inject(AddressService);

  constructor() {}

  ngOnInit() {
    this.checkUrl();

    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.model = cart;
      },
    });

    this.getAddresses();

    this.addressSub = this.addressService.addresses.subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      },
    });
  }

  async getAddresses() {
    try {
      const addresses: any[] = await this.addressService.getAddresses();

      if (addresses?.length > 0) {
        this.address = addresses.find((address) => address.primary);
      }
    } catch (e) {
      console.log(e);
    }
  }

  checkUrl() {
    const route_url = this.router.url;
    const urlParts = route_url.split('/');
    urlParts.pop(); // Remove the last segment
    console.log(urlParts);
    this.previous = urlParts.join('/');
    console.log('url: ', this.previous);
  }

  addQuantity(item: any) {
    this.cartService.addQuantity({ ...item, id: item?.item_id });
  }

  subtractQuantity(item: any) {
    this.cartService.subtractQuantity({ ...item, id: item?.item_id });
  }

  closeCouponModal(coupon: any, couponModal: IonModal) {
    console.log('coupon data: ', coupon);
    if (coupon) {
      this.selectedCoupon = coupon;
      this.model.grandTotal -= this.selectedCoupon?.saved;
    }
    couponModal.dismiss();
  }

  removeCoupon() {
    this.model.grandTotal += this.selectedCoupon?.saved;
    this.selectedCoupon = null;
  }

  closeAddAddressModal(data: any) {
    console.log(data);
    this.add_address_modal.dismiss();
    if (data) {
      this.address = data;
      if (this.isCheckoutToShippingAddress) {
        // navigate to payment page
        this.isCheckoutToShippingAddress = false;
        this.navigateToPayout();
      }
    }
  }

  closeAddressModal(data: any) {
    this.address_modal.dismiss();
    if (data) {
      if (data == 1) {
        this.isAddAddress = true;
      } else {
        this.address = data;
      }
    }
  }

  checkout() {
    if (!this.address) {
      this.isAddAddress = true;
      this.isCheckoutToShippingAddress = true;
    } else {
      //navigate to payment page
      this.navigateToPayout();
    }
  }

  navigateToPayout() {
    // if(!this.address) return;
    let data: any = {
      grandTotal: this.model?.grandTotal,
      totalPrice: this.model?.totalPrice,
      total_delivery_charge: this.model?.total_delivery_charge,
      totalItem: this.model?.totalItem,
      items: this.model.items,
      address: JSON.stringify(this.address),
      tax: this.model.tax || 0,
    }; 

    if (this.selectedCoupon) {
      data = {
        ...data,
        discount: this.selectedCoupon?.saved,
        coupon: this.selectedCoupon.code,
      };
    }

    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data),
      }
    };
    this.router.navigate([this.router.url, 'payment-option'], navData);
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
    if (this.addressSub) this.addressSub.unsubscribe();
  }
}
