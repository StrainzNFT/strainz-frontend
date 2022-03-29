import { TestBed } from '@angular/core/testing';

import { WeedService } from './weed.service';

describe('WeedService', () => {
  let service: WeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
