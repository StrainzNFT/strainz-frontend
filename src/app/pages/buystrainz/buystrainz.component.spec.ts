import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuystrainzComponent } from './buystrainz.component';

describe('BuystrainzComponent', () => {
  let component: BuystrainzComponent;
  let fixture: ComponentFixture<BuystrainzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuystrainzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuystrainzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
