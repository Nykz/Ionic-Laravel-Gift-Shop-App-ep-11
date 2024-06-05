import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemDetailPage } from './item-detail.page';

describe('ItemDetailPage', () => {
  let component: ItemDetailPage;
  let fixture: ComponentFixture<ItemDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
