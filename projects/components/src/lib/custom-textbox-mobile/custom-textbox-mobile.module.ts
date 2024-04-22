import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomTextboxComponent } from './custom-textbox-mobile.component';
import { createCustomElement } from '@angular/elements';
import { control } from './custom-textbox-mobile.control';
import {
  SmiWindow,
  isSasMobileWindowApi,
} from '@sassoftware/mobile-investigator';

@NgModule({
  declarations: [CustomTextboxComponent],
  imports: [CommonModule, FormsModule],
  exports: [CustomTextboxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (injector: Injector) => {
        return () => {
          customElements.define(
            control.directiveName,
            createCustomElement(CustomTextboxComponent, { injector: injector })
          );

          const smiWindow = window as SmiWindow;
          if (isSasMobileWindowApi(smiWindow.sas)) {
            smiWindow.sas.smi?.config.registerSolutionExtension(control);
          } else {
            smiWindow.sas.vi?.config.registerSolutionExtension(control);
          }
        };
      },
      deps: [Injector],
    },
  ],
})
export class CustomTextboxMobileModule {}
