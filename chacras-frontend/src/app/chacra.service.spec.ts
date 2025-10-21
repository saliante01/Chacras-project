import { TestBed } from '@angular/core/testing';

import { ChacraService } from './chacra.service';

describe('ChacraService', () => {
  let service: ChacraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChacraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
