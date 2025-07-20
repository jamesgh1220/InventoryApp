import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public showMenu:Boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const showMenu = event.url === '/'; // o usar includes('/home') si hay parámetros
        this.showMenu = showMenu;
        this.menuCtrl.enable(showMenu);
      }
    });
  }
}
