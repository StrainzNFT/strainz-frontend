import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrainzSortHeaderComponent } from './strainz-sort-header.component';

describe('StrainzSortHeaderComponent', () => {
  let component: StrainzSortHeaderComponent;
  let fixture: ComponentFixture<StrainzSortHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrainzSortHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrainzSortHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
