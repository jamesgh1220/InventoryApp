import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { Platform, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: false,
})
export class ScanPage {
  scannedValue: string | null = null;

  constructor(
    private platform: Platform,
    private productService: ProductService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async startScan() {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE, // u otro formato según lo que necesites
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK
      });
      console.log('result'), result;
      
      if (result && result.ScanResult) {
        this.scannedValue = result.ScanResult;
        console.log('Resultado escaneo:', this.scannedValue);
      } else {
        console.log('No se detecto código');
      }

    } catch (err) {
      console.error('Error al escanear:', err);
    }
  }
}
