import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainDetailComponent } from './strain-detail.component';

describe('StrainDetailComponent', () => {
  let component: StrainDetailComponent;
  let fixture: ComponentFixture<StrainDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
