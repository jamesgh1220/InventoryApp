// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private storageKey = 'my_inventory_products_v1';

  constructor() {}

  private saveAll(products: Product[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  private loadAll(): Product[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Product[];
    } catch {
      return [];
    }
  }

  async createProduct(data: {
    name: string;
    sku?: string;
    category?: string;
    description?: string;
  }): Promise<Product> {
    const products = this.loadAll();
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    // ✅ El QR ahora solo contiene el ID
    const qrDataUrl = await QRCode.toDataURL(id, { margin: 1, width: 300 });

    const product: Product = {
      id,
      name: data.name,
      sku: data.sku,
      category: data.category,
      description: data.description,
      createdAt,
      qrDataUrl
    };

    products.unshift(product);
    this.saveAll(products);
    return product;
  }

  getAll(): Product[] {
    return this.loadAll();
  }

  getById(id: string): Product | undefined {
    return this.loadAll().find(p => p.id === id);
  }

  updateProduct(id: string, patch: Partial<Product>): Product | undefined {
    const products = this.loadAll();
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return undefined;
    const updated = { ...products[i], ...patch };
    products[i] = updated;
    this.saveAll(products);
    return updated;
  }

  deleteProduct(id: string): boolean {
    let products = this.loadAll();
    const originalLength = products.length;
    products = products.filter(p => p.id !== id);
    this.saveAll(products);
    return products.length !== originalLength;
  }

  // Método por si quieres regenerar el QR (ej: cambias información principal):
  async regenerateQrForProduct(product: Product): Promise<string> {
    const payload = JSON.stringify({
      id: product.id,
      name: product.name,
      sku: product.sku ?? null,
      updatedAt: new Date().toISOString()
    });
    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 300 });
    this.updateProduct(product.id, { qrDataUrl });
    return qrDataUrl;
  }
}
