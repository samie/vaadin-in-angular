import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Inject the Vaadin web component bundle (all components) at runtime,
// so Vite's pre-transform step never tries to resolve the proxied URL as a local file.
// The proxy (proxy.conf.json) forwards /vaadin/web-component/* → localhost:8080.
const vaadinScript = document.createElement('script');
vaadinScript.type = 'module';
vaadinScript.src = '/vaadin/web-component/web-component-bootstrap.js';

document.head.appendChild(vaadinScript);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
