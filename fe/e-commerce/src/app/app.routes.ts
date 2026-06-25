// Route table — product list is the default, checkout lives at /checkout
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '',         component: ProductListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**',       redirectTo: '' }
];
