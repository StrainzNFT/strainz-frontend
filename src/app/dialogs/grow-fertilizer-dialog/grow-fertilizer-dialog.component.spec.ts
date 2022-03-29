import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowFertilizerDialogComponent } from './grow-fertilizer-dialog.component';

describe('GrowFertilizerDialogComponent', () => {
  let component: GrowFertilizerDialogComponent;
  let fixture: ComponentFixture<GrowFertilizerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowFertilizerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowFertilizerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
