import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `<p>Example component works!</p>`,
  styles: [`
    p {
      color: #666;
    }
  `]
})
export class ExampleComponent {

}
