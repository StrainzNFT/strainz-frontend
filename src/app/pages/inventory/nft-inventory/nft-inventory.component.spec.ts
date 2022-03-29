import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftInventoryComponent } from './nft-inventory.component';

describe('NftInventoryComponent', () => {
  let component: NftInventoryComponent;
  let fixture: ComponentFixture<NftInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
