import { getProducts } from '../api';
import Rating from '../components/rating';
import { hideLoading, parseRequestUrl, showLoading } from '../utils';

const ProductsPage = {
  render: async () => {
    const { value } = parseRequestUrl();
    showLoading();
    const products = await getProducts({ searchKeyWord: value });
    hideLoading();

    return `
      <div class="admin-dashboard-container">
          <nav class="admin-dashboard-nav" id="products-nav">
          <div class="product-filter-title">Find your product</div>
            <form id="search-form">
              <input type="text" name="search" id="input-search" value="${
                value || ''
              }"/>
              <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
              </form>
              <div class="product-filter-title">Filter by category</div>
              <ul class="product-categoryFilter-ul"></ul>
              <div class="product-filter-title">Filter by brand</div>
              <ul class="product-brandFilter-ul"></ul>
          </nav>
          <ul class="products-ul">
              ${products
                .map(
                  (product) => `
                  <li class="products-li">
                      <a href="/#/product/${product._id}" class="product">
                          <div class="product-image-container">
                              <img src="${product.image}" alt="${
                    product.name
                  }" class="product-image"/>
                          </div>
                          <div class="product-name product-info">${
                            product.name
                          }</div>
                          <div class="product-brand product-info">${
                            product.brand
                          }</div>
                          <div class="product-rating product-info">${Rating.render(
                            {
                              value: product.rating,
                              text: `${product.numReviews} reviews`,
                            },
                          )}</div>
                          <div class="product-price product-info">$${
                            product.price
                          }</div>
                      </a>
                  </li>
              `,
                )
                .join('\n')}
          </ul>
        </div>
        `;
  },
  after_render: async () => {
    const products = await getProducts('');

    let categoryArray = [];
    let brandArray = [];
    products.forEach((product) => {
      const productType = product.type.trim();
      const productBrand = product.brand.trim();
      if (!categoryArray.includes(productType)) {
        categoryArray = [...categoryArray, productType];
      }
      if (!brandArray.includes(productBrand)) {
        brandArray = [...brandArray, productBrand];
      }
    });

    const sendCategoryOnPage = (array, str) => {
      array.forEach((value) => {
        const ul = document.querySelector(`.product-${str}Filter-ul`);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('products-filter-link');
        a.href = `/#/products/?q=${value}`;
        a.textContent = value;
        li.appendChild(a);
        ul.appendChild(li);
      });
    };
    sendCategoryOnPage(categoryArray, 'category');
    sendCategoryOnPage(brandArray, 'brand');
    document
      .getElementById('search-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchKeyWord = document.getElementById('input-search').value;
        document.location.hash = `/products/?q=${searchKeyWord}`;
      });
  },
};
export default ProductsPage;
