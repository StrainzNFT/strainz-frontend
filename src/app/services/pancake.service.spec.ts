import { TestBed } from '@angular/core/testing';

import { PancakeService } from './pancake.service';

describe('PancakeService', () => {
  let service: PancakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PancakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
