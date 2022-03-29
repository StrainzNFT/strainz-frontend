import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeOverviewComponent } from './stake-overview.component';

describe('StakeOverviewComponent', () => {
  let component: StakeOverviewComponent;
  let fixture: ComponentFixture<StakeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
