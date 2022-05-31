import { Component, VERSION } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  example = {
    id: '-N3ATj__eZbBUebZcuh7',
    intentId: '-N2hPcONNZVX-IJq4TtI',
    text: 'thu nghiem xem the nao thu nghiem thu xem thu thu',
    entities: [
      {
        text: 'nghiem',
        entityId: '---',
      },
      {
        text: 'thu nghiem',
        entityId: '+++',
      },
      {
        text: 'thu',
        entityId: '***',
      },
    ],
  };
}
