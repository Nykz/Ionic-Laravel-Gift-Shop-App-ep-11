import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  constructor() {}

  async placeOrder(data: any) {
    try {
      const result = await lastValueFrom(
        this.http.post<any>(environment.serverUrl + 'order', data)
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getOrders() {
    try {
      const result = await lastValueFrom(
        this.http.get<any>(environment.serverUrl + 'order')
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
