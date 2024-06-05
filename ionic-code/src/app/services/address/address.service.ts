import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private _addresses = new BehaviorSubject<any>([]);

  get addresses() {
    return this._addresses.asObservable();
  }

  private http = inject(HttpClient);

  constructor() {}

  async addAddress(formData: any) {
    try {
      let addresses = this._addresses.value;
      if (addresses?.length == 0) {
        formData = { ...formData, primary: true };
      }

      const result = await lastValueFrom(
        this.http.post<any>(environment.serverUrl + 'address', formData)
      );

      if(result?.success == 1) {
        addresses = addresses.concat(result?.data);
        this._addresses.next(addresses);
        return result?.data;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  async getAddresses() {
    try {
      const result = await lastValueFrom(
        this.http.get<any>(environment.serverUrl + 'address')
      );

      if(result?.success == 1) {
        this._addresses.next(result?.data);
        return result?.data;
      }
      return null;
    } catch(e) {
      throw(e);
    }
  }
}
