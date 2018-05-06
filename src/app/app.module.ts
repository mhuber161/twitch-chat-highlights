import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HighlightsComponent, SafePipe } from './highlights/highlights.component';

@NgModule({
  declarations: [
    AppComponent,
    HighlightsComponent,
    SafePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
