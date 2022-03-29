import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeOfferDialogComponent } from './make-offer-dialog.component';

describe('MakeOfferDialogComponent', () => {
  let component: MakeOfferDialogComponent;
  let fixture: ComponentFixture<MakeOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeOfferDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
