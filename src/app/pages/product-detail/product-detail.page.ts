import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = await this.productService.getProductById(id);
    }
  }

  async updateStock(change: number) {
    if (!this.product) return;
    this.product.stock += change;
    await this.productService.update(this.product);
  }

  async changePicture() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    if (this.product) {
      this.product.image = `data:image/jpeg;base64,${image.base64String}`;
      await this.productService.update(this.product);
    }
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Deseas eliminar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (!this.product) return;
            const list = await this.productService.getAll();
            const newList = list.filter((p) => p.id !== this.product!.id);
            const store = await (this.productService as any)._getStore();
            await store.set('products', newList);
            this.navCtrl.back();
          },
        },
      ],
    });
    alert.present();
  }

  back() {
    this.navCtrl.back();
  }
}
