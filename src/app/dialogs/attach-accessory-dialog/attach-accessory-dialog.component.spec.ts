import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachAccessoryDialogComponent } from './attach-accessory-dialog.component';

describe('AttachAccessoryDialogComponent', () => {
  let component: AttachAccessoryDialogComponent;
  let fixture: ComponentFixture<AttachAccessoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachAccessoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachAccessoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
