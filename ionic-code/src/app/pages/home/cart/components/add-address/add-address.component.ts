import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonIcon,
  IonButton,
  IonList,
  IonInput,
  IonText,
  IonTextarea,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonToggle,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonTextarea,
    IonText,
    IonInput,
    IonList,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonToggle,
    ReactiveFormsModule,
  ],
})
export class AddAddressComponent implements OnInit {
  form!: FormGroup;
  @Output() close: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  private addressService = inject(AddressService);

  constructor() {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    this.form = new FormGroup({
      pincode: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl(null, { validators: [Validators.required] }),
      house_no: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      state: new FormControl(null, { validators: [Validators.required] }),
      country: new FormControl(null, { validators: [Validators.required] }),
      save_as: new FormControl(null, { validators: [Validators.required] }),
      landmark: new FormControl(null, { validators: [] }),
      primary: new FormControl(false, { validators: [] }),
    });
  }

  dismiss(data?: any) {
    this.close.emit(data);
  }

  async save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.addAddress(this.form.value);
  }

  async addAddress(data: any) {
    try {
      const address = await this.addressService.addAddress(data);
      this.dismiss(address);
    } catch (e) {
      console.log(e);
    }
  }
}
