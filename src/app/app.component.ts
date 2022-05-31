import { Component, VERSION } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  sanitizeredText: SafeHtml;
}
