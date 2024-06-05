import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentOptionPage } from './payment-option.page';

describe('PaymentOptionPage', () => {
  let component: PaymentOptionPage;
  let fixture: ComponentFixture<PaymentOptionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
