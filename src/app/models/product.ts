export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  description?: string;
  createdAt: string; // ISO date
  qrDataUrl?: string; // Data URL del QR (persistimos el QR en localStorage)
}
