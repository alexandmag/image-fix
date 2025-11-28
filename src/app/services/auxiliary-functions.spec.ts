import { TestBed } from '@angular/core/testing';

import { AuxiliaryFunctions } from './auxiliary-functions';

describe('AuxiliaryFunctions', () => {
  let service: AuxiliaryFunctions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxiliaryFunctions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
