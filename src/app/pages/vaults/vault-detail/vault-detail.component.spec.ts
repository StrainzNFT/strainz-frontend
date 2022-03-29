import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultDetailComponent } from './vault-detail.component';

describe('VaultDetailComponent', () => {
  let component: VaultDetailComponent;
  let fixture: ComponentFixture<VaultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
