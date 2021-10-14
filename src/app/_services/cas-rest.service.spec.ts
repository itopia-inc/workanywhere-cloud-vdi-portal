import { TestBed } from '@angular/core/testing';

import { CasRestService } from './cas-rest.service';

describe('CasRestService', () => {
  let service: CasRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
