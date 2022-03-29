import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedDialogComponent } from './breed-dialog.component';

describe('BreedDialogComponent', () => {
  let component: BreedDialogComponent;
  let fixture: ComponentFixture<BreedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
