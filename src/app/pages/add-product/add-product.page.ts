import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: false,
})
export class AddProductPage {
  code = '';
  name = '';
  category = '';
  stock = 0;
  imageBase64 = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      this.code = params['code'] || '';
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    this.imageBase64 = `data:image/jpeg;base64,${image.base64String}`;
  }

  async save() {
    const newProduct: Product = {
      id: uuidv4(),
      code: this.code,
      name: this.name,
      category: this.category,
      stock: this.stock,
      image: this.imageBase64 || undefined,
      createdAt: Date.now(),
    };
    await this.productService.save(newProduct);
    this.router.navigate(['/']);
  }
}
