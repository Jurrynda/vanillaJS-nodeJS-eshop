/* eslint-disable indent */
import { getProduct } from '../api';
import { hideLoading, parseRequestUrl, showLoading } from '../utils';
import Rating from '../components/rating';

const ProductPage = {
  after_render: async () => {
    const request = parseRequestUrl();
    document.getElementById('add-button').addEventListener('click', () => {
      document.location.hash = `/cart/${request.id}`;
    });
  },
  render: async () => {
    showLoading();
    const request = parseRequestUrl();
    // ajax request
    const product = await getProduct(request.id);
    if (product.error) {
      return `<div>${product.error}</div>`;
    }
    hideLoading();
    return `
      <div class="product-content-container">
        <a class="back-to-products-link" href=/#/products>
          <i class="fa-solid fa-chevron-left fa-xl"></i>
        </a>
        <div class="product-content-image-container">
          <img class="product-content-image" src="${product.image}">
        </div>
        <div class="product-content-info">
          <div class="product-content-info-top">
            <ul>
              <li>
                <h1>${product.name}</h1>
              </li>
              <li>
                ${Rating.render({
                  value: product.rating,
                  text: `${product.numReviews} reviews`,
              })}
              </li>
              <li> Brand:
                ${product.brand}
              </li>
              <li> Status :
                ${product.countInStock > 0
                  ? '<span class="sucess">In stock</span>'
                  : '<span class="error">Unavaible</span>'
                }
              </li>
              <li> Price:
                <strong>$ ${product.price} </strong>
              </li>
              <li>
                ${product.countInStock > 0
                ? '<button id="add-button" class="fw add-to-cart-btn">add to cart</button>'
                : ''
                }
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },
};
export default ProductPage;
