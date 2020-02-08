import { TestBed } from '@angular/core/testing';

import { InputMaskPhoneService } from './input-mask-phone.service';

describe('InputMaskPhoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputMaskPhoneService = TestBed.get(InputMaskPhoneService);
    expect(service).toBeTruthy();
  });
});
