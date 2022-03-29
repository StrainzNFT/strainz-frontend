import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAccessoryDialogComponent } from './transfer-accessory-dialog.component';

describe('TransferAccessoryDialogComponent', () => {
  let component: TransferAccessoryDialogComponent;
  let fixture: ComponentFixture<TransferAccessoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAccessoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAccessoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
