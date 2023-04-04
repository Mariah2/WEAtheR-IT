import { Component } from '@angular/core';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-dashboard></app-dashboard>
  `,
  imports: [HeaderComponent, DashboardComponent]
})
export class AppComponent { }
