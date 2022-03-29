import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNftDialogComponent } from './sell-nft-dialog.component';

describe('SellNftDialogComponent', () => {
  let component: SellNftDialogComponent;
  let fixture: ComponentFixture<SellNftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellNftDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellNftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
