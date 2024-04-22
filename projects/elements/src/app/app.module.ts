import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ComponentsAppModule } from 'projects/components/src/app.module';

@NgModule({
  imports: [BrowserModule, ComponentsAppModule],
  providers: [],
})
export class AppModule {
  ngDoBootstrap() {}
}
