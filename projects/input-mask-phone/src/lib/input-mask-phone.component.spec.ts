import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMaskPhoneComponent } from './input-mask-phone.component';

describe('InputMaskPhoneComponent', () => {
  let component: InputMaskPhoneComponent;
  let fixture: ComponentFixture<InputMaskPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputMaskPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMaskPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
