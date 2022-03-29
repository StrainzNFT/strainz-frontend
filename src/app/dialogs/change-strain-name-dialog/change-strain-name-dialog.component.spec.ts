import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStrainNameDialogComponent } from './change-strain-name-dialog.component';

describe('ChangeStrainNameDialogComponent', () => {
  let component: ChangeStrainNameDialogComponent;
  let fixture: ComponentFixture<ChangeStrainNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStrainNameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStrainNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
