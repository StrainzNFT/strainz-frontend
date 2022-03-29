import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultsOverviewComponent } from './vaults-overview.component';

describe('VaultsOverviewComponent', () => {
  let component: VaultsOverviewComponent;
  let fixture: ComponentFixture<VaultsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
