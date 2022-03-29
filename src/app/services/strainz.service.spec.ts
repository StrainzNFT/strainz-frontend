import { TestBed } from '@angular/core/testing';

import { StrainzService } from './strainz.service';

describe('StrainzService', () => {
  let service: StrainzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrainzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
