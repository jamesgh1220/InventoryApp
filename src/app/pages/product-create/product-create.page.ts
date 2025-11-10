// src/app/pages/product-create/product-create.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.page.html',
  styleUrls: ['./product-create.page.scss'],
  standalone: false,
})
export class ProductCreatePage {
  form: FormGroup;
  previewQrDataUrl?: string;
  createdProduct?: Product;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      category: [''],
      description: ['']
    });
  }

  async submit() {
    if (this.form.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa el nombre', duration: 1500 });
      t.present();
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Creando...' });
    await loading.present();

    try {
      const val = this.form.value;
      this.createdProduct = await this.productService.createProduct({
        name: val.name,
        sku: val.sku,
        category: val.category,
        description: val.description
      });
      this.previewQrDataUrl = this.createdProduct.qrDataUrl;
      await loading.dismiss();
      const t = await this.toastCtrl.create({ message: 'Producto creado', duration: 1200 });
      t.present();
      // Opcional: navegar a la vista del producto
      // this.router.navigateByUrl(`/products/view/${this.createdProduct.id}`);
    } catch (err) {
      await loading.dismiss();
      const t = await this.toastCtrl.create({ message: 'Error al crear', duration: 1500 });
      t.present();
      console.error(err);
    }
  }

  printQr() {
    // Abrir una nueva ventana con solo la imagen y llamar a print.
    if (!this.previewQrDataUrl) return;
    const w = window.open('', '_blank');
    if (!w) { alert('Popup bloqueado. Habilita ventanas emergentes o usa imprimir desde la vista del producto.'); return; }
    w.document.write(`
      <html>
        <head>
          <title>Imprimir QR</title>
          <style>
            body { display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
            img { max-width:90%; max-height:90%; }
            .meta { text-align:center; font-family: Arial, sans-serif; margin-top:12px; }
          </style>
        </head>
        <body>
          <div>
            <img src="${this.previewQrDataUrl}" />
            <div class="meta">
              <div>${this.form.value.name}</div>
              <div>${this.form.value.sku || ''}</div>
            </div>
          </div>
          <script>
            window.onload = function() { setTimeout(()=>{ window.print(); }, 300); }
          </script>
        </body>
      </html>
    `);
    w.document.close();
  }
}
