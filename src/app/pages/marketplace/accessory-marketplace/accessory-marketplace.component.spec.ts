import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryMarketplaceComponent } from './accessory-marketplace.component';

describe('AccessoryMarketplaceComponent', () => {
  let component: AccessoryMarketplaceComponent;
  let fixture: ComponentFixture<AccessoryMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryMarketplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoryMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
