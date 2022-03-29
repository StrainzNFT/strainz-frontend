import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainzFilterComponent } from './strainz-filter.component';

describe('StrainzFilterComponent', () => {
  let component: StrainzFilterComponent;
  let fixture: ComponentFixture<StrainzFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainzFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainzFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
