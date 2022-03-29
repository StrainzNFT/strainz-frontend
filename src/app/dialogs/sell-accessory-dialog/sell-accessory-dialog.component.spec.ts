import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAccessoryDialogComponent } from './sell-accessory-dialog.component';

describe('SellDialogComponent', () => {
  let component: SellAccessoryDialogComponent;
  let fixture: ComponentFixture<SellAccessoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellAccessoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAccessoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
