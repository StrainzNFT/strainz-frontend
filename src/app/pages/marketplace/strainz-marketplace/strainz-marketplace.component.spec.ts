import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainzMarketplaceComponent } from './strainz-marketplace.component';

describe('StrainzMarketplaceComponent', () => {
  let component: StrainzMarketplaceComponent;
  let fixture: ComponentFixture<StrainzMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainzMarketplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainzMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
