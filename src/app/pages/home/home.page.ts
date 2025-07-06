import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Product } from 'src/app/models/product';
import { ExportService } from 'src/app/services/export.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  products: Product[] = [];

  ionViewWillEnter() {
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.productService.getAll();
  }

  async scanCode() {
    try {
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (!permission.granted) {
        console.warn('Permiso de cámara denegado');
        return;
      }

      // Oculta el fondo para modo escáner
      await BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active'); // Para estilos opcionales

      // Inicia el escaneo
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const code = result.content;

        const product = await this.productService.getProductByCode(code);
        if (product) {
          this.router.navigate(['/product-detail', product.id]);
        } else {
          this.router.navigate(['/add-product'], { queryParams: { code } });
        }
      }
    } catch (err) {
      console.error('Error escaneando:', err);
    } finally {
      // Siempre detener escáner y restaurar fondo
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      document.body.classList.remove('scanner-active');
    }
  }

  openDetail(product: Product) {
    this.router.navigate(['/product-detail', product.id]);
  }

  addProduct() {
    this.router.navigate(['/add-product'], { queryParams: { code: '' } });
  }

  // ---- Exportaciones ----
  async export(type: 'csv' | 'pdf') {
    const filename =
      type === 'csv'
        ? await this.exportService.exportCSV()
        : await this.exportService.exportPDF();
    const toast = await this.toastCtrl.create({
      message: `${type.toUpperCase()} generado: ${filename}`,
      duration: 3000,
    });
    toast.present();
  }
}
