// src/app/pages/product-view/product-view.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.page.html',
  styleUrls: ['./product-view.page.scss'],
  standalone: false,
})
export class ProductViewPage implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id: string) {
    this.product = this.productService.getById(id);
    if (!this.product) {
      // producto no encontrado, volver a lista
      this.router.navigateByUrl('/products');
    }
  }

  printCard() {
    if (!this.product?.qrDataUrl) return;
    const html = `
      <html>
        <head>
          <title>Imprimir etiqueta</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: Arial, sans-serif; padding:20px; display:flex; justify-content:center; align-items:center; }
            .label { border:1px solid #000; padding:12px; display:flex; flex-direction:column; align-items:center; width:300px; }
            .label img { width:240px; height:240px; object-fit:contain; }
            .meta { margin-top:8px; text-align:center; }
          </style>
        </head>
        <body>
          <div class="label">
            <img src="${this.product.qrDataUrl}" />
            <div class="meta">
              <div><strong>${this.product.name}</strong></div>
              <div>${this.product.sku || ''}</div>
              <div>${this.product.category || ''}</div>
            </div>
          </div>
          <script>window.onload = function(){ setTimeout(()=>window.print(), 200); }</script>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (!w) { alert('No se pudo abrir ventana para imprimir.'); return; }
    w.document.write(html);
    w.document.close();
  }

  async deleteProduct() {
    if (!this.product) return;
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `Eliminar producto "${this.product.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.productService.deleteProduct(this.product!.id);
            this.router.navigateByUrl('/products');
          }
        }
      ]
    });
    await alert.present();
  }
}
