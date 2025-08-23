import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./layout/toolbar/toolbar/toolbar.component";
import { SidebarComponent } from "./layout/sidebar/sidebar/sidebar.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my_big_crm_system';
}
