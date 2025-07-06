import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { jsPDF } from 'jspdf';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private productService: ProductService) {}

  async exportCSV(): Promise<string> {
    const products = await this.productService.getAll();
    const header = 'ID,Código,Nombre,Categoría,Stock,Creado\n';
    const rows = products
      .map(
        (p) =>
          `${p.id},${p.code},${p.name},${p.category || ''},${
            p.stock
          },${new Date(p.createdAt).toISOString()}`
      )
      .join('\n');
    const csv = header + rows;

    const filename = `inventario_${Date.now()}.csv`;
    await Filesystem.writeFile({
      path: filename,
      directory: Directory.Documents,
      data: csv,
      encoding: Encoding.UTF8,
    });
    return filename;
  }

  async exportPDF(): Promise<string> {
    const products = await this.productService.getAll();
    const doc = new jsPDF();
    doc.text('Inventario', 10, 10);

    const headers = ['Código', 'Nombre', 'Categoría', 'Stock'];
    let y = 20;
    doc.text(headers.join(' | '), 10, y);
    y += 6;

    products.forEach((p) => {
      doc.text(
        `${p.code} | ${p.name} | ${p.category || ''} | ${p.stock}`,
        10,
        y
      );
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    const pdfData = doc.output('datauristring');
    const filename = `inventario_${Date.now()}.pdf`;
    await Filesystem.writeFile({
      path: filename,
      directory: Directory.Documents,
      data: pdfData.split(',')[1], // quitar encabezado data:application/pdf;base64,
      // encoding: Encoding.Base64,
    });
    return filename;
  }
}
