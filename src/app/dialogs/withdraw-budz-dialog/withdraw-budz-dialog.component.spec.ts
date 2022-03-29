import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawBudzDialogComponent } from './withdraw-budz-dialog.component';

describe('WithdrawBudzDialogComponent', () => {
  let component: WithdrawBudzDialogComponent;
  let fixture: ComponentFixture<WithdrawBudzDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawBudzDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawBudzDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
