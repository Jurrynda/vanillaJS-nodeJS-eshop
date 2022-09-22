import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import Error404Page from './pages/Error404Page';
import HomePage from './pages/HomePage';
import { hideLoading, parseRequestUrl, showLoading } from './utils';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import Footer from './components/footer';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProductEditPage from './pages/ProductEditPage';

const routes = {
  '/': HomePage,
  '/products': ProductsPage,
  '/product/:id': ProductPage,
  '/order/:id': OrderPage,
  '/cart/:id': CartPage,
  '/cart': CartPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/profile': ProfilePage,
  '/shipping': ShippingPage,
  '/payment': PaymentPage,
  '/placeorder': PlaceOrderPage,
  '/dashboard-orders': AdminOrdersPage,
  '/dashboard-products': AdminProductsPage,
  '/edit-product/:id': ProductEditPage,
};

const router = async () => {
  showLoading();
  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') + (request.id ? '/:id' : '');

  const page = routes[parseUrl] ? routes[parseUrl] : Error404Page;
  const header = document.getElementById('header-container');
  header.innerHTML = Header.render();
  Header.after_render();
  const footer = document.querySelector('.footer');
  footer.innerHTML = Footer.render();
  const main = document.getElementById('main');
  main.innerHTML = await page.render();
  if (page.after_render) {
    await page.after_render();
  }
  hideLoading();
};
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
