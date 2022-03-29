import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompostDialogComponent } from './compost-dialog.component';

describe('CompostDialogComponent', () => {
  let component: CompostDialogComponent;
  let fixture: ComponentFixture<CompostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompostDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
