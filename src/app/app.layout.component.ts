import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar/sidebar.component';
import { ToolbarComponent } from './layout/toolbar/toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, ToolbarComponent, RouterModule],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col">
        <app-toolbar></app-toolbar>
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {}
