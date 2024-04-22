import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DesktopCustomTextboxModule } from './lib/desktop-custom-textbox/desktop-custom-textbox.module';

@NgModule({
  imports: [
    DesktopCustomTextboxModule
  ],
  providers: [],
})
export class ComponentsAppModule {
}
