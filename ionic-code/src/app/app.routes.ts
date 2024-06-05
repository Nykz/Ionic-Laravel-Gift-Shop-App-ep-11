import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/home/cart/cart.page').then((m) => m.CartPage),
          },
          {
            path: 'payment-option',
            loadComponent: () =>
              import(
                './pages/home/cart/payment-option/payment-option.page'
              ).then((m) => m.PaymentOptionPage),
          },
        ],
      },
      {
        path: 'gifts/:id',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/home/item-detail/item-detail.page').then(
                (m) => m.ItemDetailPage
              ),
          },
          {
            path: 'cart',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/home/cart/cart.page').then((m) => m.CartPage),
              },
              {
                path: 'payment-option',
                loadComponent: () =>
                  import(
                    './pages/home/cart/payment-option/payment-option.page'
                  ).then((m) => m.PaymentOptionPage),
              },
            ],
          },
        ],
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/home/orders/orders.page').then( m => m.OrdersPage)
      },
    ],
    canMatch: [async () => await inject(AuthService).authGuard()],
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/login/signup/signup.page').then((m) => m.SignupPage),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/home/about/about.page').then( m => m.AboutPage),
    canMatch: [async () => await inject(AuthService).authGuard()],
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/home/privacy/privacy.page').then( m => m.PrivacyPage),
    canMatch: [async () => await inject(AuthService).authGuard()],
  },
];
