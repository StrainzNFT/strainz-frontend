import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainzInventoryComponent } from './strainz-inventory.component';

describe('StrainzInventoryComponent', () => {
  let component: StrainzInventoryComponent;
  let fixture: ComponentFixture<StrainzInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainzInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainzInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
