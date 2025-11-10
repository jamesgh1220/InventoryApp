import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
  standalone: false,
})
export class ProductEditPage implements OnInit {
  form!: FormGroup;
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.product = this.productService.getById(id);

    if (!this.product) {
      this.router.navigateByUrl('/products');
      return;
    }

    this.form = this.fb.group({
      name: [this.product.name, Validators.required],
      sku: [this.product.sku],
      category: [this.product.category],
      description: [this.product.description]
    });
  }

  async save() {
    if (!this.product) return;
    if (this.form.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa el nombre', duration: 1500 });
      t.present();
      return;
    }

    this.productService.updateProduct(this.product.id, this.form.value);
    const t = await this.toastCtrl.create({ message: 'Producto actualizado', duration: 1500 });
    await t.present();
    this.router.navigateByUrl(`/products/view/${this.product.id}`);
  }
}
