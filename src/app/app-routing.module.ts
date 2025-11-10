import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListPageModule)
  },
  {
    path: 'products/create',
    loadChildren: () => import('./pages/product-create/product-create.module').then(m => m.ProductCreatePageModule)
  },
  {
    path: 'products/view/:id',
    loadChildren: () => import('./pages/product-view/product-view.module').then(m => m.ProductViewPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./pages/scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'product-edit/:id',
    loadChildren: () => import('./pages/product-edit/product-edit.module').then( m => m.ProductEditPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
