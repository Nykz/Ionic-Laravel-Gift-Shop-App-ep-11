import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(key: string, value: string) {
    Preferences.set({ key: key, value: value });
  }

  getStorage(key: string) {
    return Preferences.get({ key: key });
  }

  removeStorage(key: string) {
    Preferences.remove({ key: key });
  }

  clearStorage() {
    Preferences.clear();
  }
}
