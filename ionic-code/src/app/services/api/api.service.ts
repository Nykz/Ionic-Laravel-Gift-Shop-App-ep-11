import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() {}

  async getCoupons() {
    // return this.coupons.filter((coupon) => coupon.isActive);
    try {
      const result: any = await lastValueFrom(
        this.http.get(environment.serverUrl + 'coupon')
      );
      if (result?.success == 1) {
        console.log(result);
        return result?.data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  async getGifts() {
    try {
      const result = await lastValueFrom(
        this.http.get(environment.serverUrl + 'gift')
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  async searchGifts(query: string) {
    try {
      const result = await lastValueFrom(
        this.http.get(environment.serverUrl + 'gift', { params: { query } })
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getGiftById(id: string) {
    try {
      const result = await lastValueFrom(
        this.http.get(environment.serverUrl + 'gift/' + id)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
