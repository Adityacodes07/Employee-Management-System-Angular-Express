// ============================================================
// app.component.ts
// The ROOT component — the shell that wraps the whole app.
// It contains the <router-outlet> which is the placeholder
// where Angular renders whichever component matches the URL.
// ============================================================

import { Component } from '@angular/core';

// RouterOutlet: the directive that renders the active route's component
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',      // This becomes <app-root> in index.html
  standalone: true,
  imports: [RouterOutlet],
  // The template is just a router-outlet — ALL page content
  // is rendered by the routed components (list, form, detail).
  template: `<router-outlet />`,
})
export class AppComponent {}
