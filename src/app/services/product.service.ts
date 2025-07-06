import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _storage: Storage | null = null;
  private key = 'products';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
  }

  private async getStore(): Promise<Storage> {
    // Espera hasta que _storage esté listo
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
    return this._storage;
  }

  async getAll(): Promise<Product[]> {
    const store = await this.getStore();
    return (await store.get(this.key)) || [];
  }

  async getProductByCode(code: string): Promise<Product | undefined> {
    const products = await this.getAll();
    return products.find((p) => p.code === code);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getAll();
    return products.find((p) => p.id === id);
  }

  async save(product: Product): Promise<void> {
    const store = await this.getStore();
    const products = await this.getAll();
    products.push(product);
    await store.set(this.key, products);
  }

  async update(product: Product): Promise<void> {
    const store = await this.getStore();
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      products[index] = product;
      await store.set(this.key, products);
    }
  }

  async removeById(id: string): Promise<void> {
    const store = await this.getStore();
    const products = await this.getAll();
    const updated = products.filter((p) => p.id !== id);
    await store.set(this.key, updated);
  }

  async clear(): Promise<void> {
    const store = await this.getStore();
    await store.remove(this.key);
  }
}
