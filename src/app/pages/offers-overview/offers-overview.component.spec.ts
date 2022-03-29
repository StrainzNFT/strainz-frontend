import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersOverviewComponent } from './offers-overview.component';

describe('OffersOverviewComponent', () => {
  let component: OffersOverviewComponent;
  let fixture: ComponentFixture<OffersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
