import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCreatePageRoutingModule } from './product-create-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCreatePage } from './product-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCreatePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProductCreatePage]
})
export class ProductCreatePageModule {}
