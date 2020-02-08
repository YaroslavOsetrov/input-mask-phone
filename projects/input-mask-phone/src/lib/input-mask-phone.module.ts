import { NgModule } from '@angular/core';
import { InputMaskPhoneComponent } from './input-mask-phone.component';
import { InputMaskPhoneDirective } from './input-mask-phone.directive';



@NgModule({
  declarations: [InputMaskPhoneComponent, InputMaskPhoneDirective],
  imports: [
  ],
  exports: [InputMaskPhoneComponent]
})
export class InputMaskPhoneModule { }
