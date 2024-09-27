import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PeriodicElementComponent } from "./components/periodic-element/periodic-element.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PeriodicElementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
