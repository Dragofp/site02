import 'reflect-metadata';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './inicio/app.config';
import { AppComponent } from './inicio/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
