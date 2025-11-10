import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [IonicModule],
  styleUrls: ['./header.component.scss'],
  // standalone: false,
})
export class HeaderComponent  implements OnInit {
  @Input() quantity: number = 0;
  filterText = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  goCreate() {
    this.router.navigateByUrl('/products/create');
  }

  goScan() {
    this.router.navigateByUrl('/scan');
  }

}
