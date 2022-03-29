import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStrainColorDialogComponent } from './change-strain-color-dialog.component';

describe('ChangeStrainColorDialogComponent', () => {
  let component: ChangeStrainColorDialogComponent;
  let fixture: ComponentFixture<ChangeStrainColorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStrainColorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStrainColorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
