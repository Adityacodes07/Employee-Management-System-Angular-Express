// ============================================================
// app.config.ts
// Global app configuration for Angular 21.
// Uses provideExperimentalZonelessChangeDetection() — this is
// Angular 21's modern approach: no zone.js needed at all.
// Change detection is triggered manually or via signals.
// ============================================================

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless change detection — replaces zone.js entirely
    // Angular 21 detects changes via Signals and explicit triggers
    provideZonelessChangeDetection(),

    // Router with our route definitions
    provideRouter(routes),

    // HttpClient for all API calls to Express backend
    provideHttpClient(withFetch()),
  ],
};
