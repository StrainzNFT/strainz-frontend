import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainImageComponent } from './strain-image.component';

describe('StrainImageComponent', () => {
  let component: StrainImageComponent;
  let fixture: ComponentFixture<StrainImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
