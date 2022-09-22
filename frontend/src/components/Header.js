/* eslint-disable indent */
import { getUserInfo } from '../localStorage';

const Header = {
  render: () => {
    const { name, isAdmin } = getUserInfo();
    return `
      <div class="header-container">
        <a href="/#/" class="header-logo-link">
            <img class="header-logo-img" src="images/eshop-logo.svg" alt="logo">
        </a>
        <div class="header-links-container">
          ${
            name
              ? `<a href="/#/profile" class="header-link profile">${name}</a>`
              : '<a href="/#/login" class="header-link">Sign-in</a>'
          }
          ${
            isAdmin
              ? '<a href="/#/dashboard-orders" class="header-link">Dashboard</a>'
              : ''
          }
            <a href="/#/cart" class="header-link">Cart</a>
            <a href="/#/products" class="header-link">E-shop</a> 
        </div>
        <div class="menu">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
        </div> 
    </div>  
      `;
  },

  after_render: () => {
    const responsiveMenu = () => {
      const menu = document.querySelector('.menu');
      const nav = document.querySelector('.header-links-container');
      const navLinks = document.querySelectorAll('.header-links-container a');
      nav.classList.toggle('nav-active');
      menu.classList.toggle('toggle');
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = '';
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`;
        }
      });
    };
    document.querySelector('.menu').addEventListener('click', responsiveMenu);
  },
};
export default Header;
