// ============================================================
// main.ts
// The very first file Angular runs.
// It bootstraps (starts) the application using:
//   - AppComponent as the root component
//   - appConfig for global providers (router, http, etc.)
// ============================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// bootstrapApplication() starts the Angular app.
// It mounts AppComponent into the <app-root> tag in index.html.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Bootstrap error:', err));
