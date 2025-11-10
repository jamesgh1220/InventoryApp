// src/app/pages/product-list/product-list.page.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: false,
})
export class ProductListPage implements OnInit {
  products: Product[] = [];
  filterText = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.products = this.productService.getAll();
  }

  goCreate() {
    this.router.navigateByUrl('/products/create');
  }

  viewProduct(id: string) {
    this.router.navigateByUrl(`/products/view/${id}`);
  }

  async deleteProduct(id: string, name: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `Eliminar producto "${name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.productService.deleteProduct(id);
            this.load();
          }
        }
      ]
    });
    await alert.present();
  }

  filtered() {
    const q = this.filterText?.toLowerCase()?.trim();
    
    if (!q) return this.products;
    return this.products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }

  handleSearch(event: any|null) {
    this.filterText = event?.detail?.value || '';
    const q = this.filterText?.toLowerCase()?.trim();
    
    if (!q) return this.products;
    return this.products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }
}
