import { Directive, Output, HostListener, EventEmitter, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import phoneCodes from './data.json';

@Directive({
  selector: '[libInputMaskPhone]'
})
export class InputMaskPhoneDirective {

  @Output() setCountry = new EventEmitter<any>();
  isRequired = false;

  constructor(public formControl: NgControl, private el: ElementRef) {
    if (this.el.nativeElement.hasAttribute('required')) {
      this.isRequired = true;
    }
  }

  masks: Array<string> = phoneCodes;

  currentMask: string;
  countryCode: string;

  isCompleted = false;

  @HostListener('input', ['$event'])
  oninput($event: any) {
    this.onKeyPress($event);
    if (!this.isCompleted && this.isRequired) {
      this.formControl.control.setErrors({ error: 'error.incorrect_phone_number' });
    }
    if ($event.target.value.length === 1) {
      $event.target.value = '+';
    }
    if (this.isRequired && $event.target.value === '+') {
      this.formControl.control.setErrors({ error: 'errors.required' });
    }
  }

  @HostListener('focus', ['$event'])
  onFocus($event: any) {
    if ($event.target.value.length === 0) {
      $event.target.value = '+1';
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    if ($event.keyCode !== 8) {
      const value = $event.target.value.replace(/\D/g, '');
      const maskDetail = this.getMask(value);

      if (maskDetail == null) {
        return;
      }

      this.currentMask = maskDetail.mask;
      this.countryCode = maskDetail.countryCode;

      $event.target.value = this.maskReplace(this.currentMask, value.replace(this.countryCode, ''));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown($event: any) {
    if ($event.target.value.length === 0) {
      $event.target.value = '+';
    }
    if ($event.keyCode === 8) {
      let value = $event.target.value;
      if (isNaN(Number(value.charAt(value.length - 1)))) {
        value = value.substring(0, value.length - 1);
      }
      $event.target.value = value;
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress($event: any) {
    this.isCompleted = false;
    const value = $event.target.value.replace(/\D/g, '');
    const maskDetail = this.getMask(value);

    if ($event.keyCode === 13) {
      return true;
    }
    if (maskDetail == null) {
      return;
    }

    this.currentMask = maskDetail.mask;
    this.countryCode = maskDetail.countryCode;

    if (value.length >= maskDetail.minlength) {
      this.isCompleted = true;
    }

    if (value.length === maskDetail.maxlength) {
      return false;
    }

    const localPhone = value.replace(this.countryCode, '');
    const formattedPhone = this.maskReplace(this.currentMask, localPhone);

    $event.target.value = formattedPhone;
  }

  protected getMask(valueNum: string) {
    const countryMasks: Array<{ index: number, maskNum: number }> = [];
    let countryCodeFinal = '';
    this.masks.forEach((mask, maskIndex) => {
      const maskClear = mask.replace('+', '');
      const countryCode = maskClear.substring(0, maskClear.indexOf('#')).replace(/\D/g, '');
      const maskNum: number = (maskClear.match(/#/g) || []).length;
      if (valueNum.startsWith(countryCode)) {
        countryCodeFinal = countryCode;
        countryMasks.push({ index: maskIndex, maskNum: maskNum + countryCode.length });
      }
    });

    if (countryMasks.length === 0) {
      return null;
    }

    countryMasks.sort((a, b) => {
      return (a.maskNum > b.maskNum) ? -1 : 1;
    });

    let maxMaskLength = 0;
    let minMaskLength = 0;
    if (countryMasks.length !== 0) {
      maxMaskLength = countryMasks[0].maskNum;
      minMaskLength = countryMasks[countryMasks.length - 1].maskNum;
    }

    let currentMask = null;
    countryMasks.forEach((mask) => {
      if (valueNum.length <= mask.maskNum) {
        currentMask = this.masks[mask.index];
      }
    });
    return { mask: currentMask, countryCode: countryCodeFinal, minlength: minMaskLength, maxlength: maxMaskLength };
  }

  protected maskReplace(mask: string, values: string) {
    let numberFormatted = mask;
    if (this.currentMask) {
      for (let i = 0; i < values.length; i++) {
        numberFormatted = this.replaceAt(numberFormatted, this.nthIndex(mask, '#', i + 1), values[i]);
      }
    }
    return (numberFormatted.indexOf('#') !== -1) ? numberFormatted.substr(0, numberFormatted.indexOf('#')) : numberFormatted;
  }

  private replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
  }

  private nthIndex(str, needle, nth) {
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === needle) {
        if (!--nth) {
          return i;
        }
      }
    }
    return false;
  }
}
