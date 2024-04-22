import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DesktopCustomTextboxComponent } from "./desktop-custom-textbox.component";
import { createCustomElement } from "@angular/elements";
import { control } from "./desktop-custom-textbox.control";
import { SviWindow } from "@sassoftware/vi-api";

@NgModule({
  declarations: [DesktopCustomTextboxComponent],
  imports: [CommonModule, FormsModule],
  exports: [DesktopCustomTextboxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (injector: Injector) => {
        return () => {
          customElements.define(
            control.directiveName,
            createCustomElement(DesktopCustomTextboxComponent, { injector: injector })
          );

          const sviWindow = window as SviWindow;
          sviWindow.sas.vi?.config.registerSolutionExtension(control);
        };
      },
      deps: [Injector]
    }
  ]
})
export class DesktopCustomTextboxModule {}
