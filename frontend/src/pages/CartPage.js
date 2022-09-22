/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-use-before-define */
/* eslint-disable no-trailing-spaces */
import { getProduct } from '../api';
import { getCartItems, setCartItems } from '../localStorage';
import { parseRequestUrl, rerender } from '../utils';

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    if (forceUpdate) {
      cartItems = cartItems.map((x) => (x.product === existItem.product ? item : x));
    }
  } else {
    cartItems = [...cartItems, item];
  }
  setCartItems(cartItems);
  if (forceUpdate) {
    rerender(CartPage);
  }
};

const removeFromCart = (id) => {
  setCartItems(getCartItems().filter((x) => x.product !== id));
  if (id === parseRequestUrl().id) {
    document.location.hash = '/cart';
  } else {
    rerender(CartPage);
  }
};

const CartPage = {
  after_render: async () => {
    const qtySelects = document.getElementsByClassName('quantity-select');

    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener('change', (e) => {
        const item = getCartItems().find((x) => x.product === qtySelect.id);
        addToCart({ ...item, quantity: Number(e.target.value) }, true);
      });
    });

    const deleteButtons = document.getElementsByClassName('delete-btn');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        removeFromCart(deleteButton.id);
      });
    });

    document.querySelector('.checkout-button').addEventListener('click', () => {
      document.location.hash = '/login';
    });
  },
  render: async () => {
    const request = parseRequestUrl();

    if (request.id) {
      const product = await getProduct(request.id);
      addToCart({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1,
      });
    }
    const cartItems = getCartItems();
    return `
    <div class="cart-page-container">
      <div class="cart-page-list">
        <h3>Shopping cart (${cartItems.reduce(
          (item, currentTotal) => item + currentTotal.quantity,
          0,
        )} items)</h3>
        <ul class="cart-list-container">
              ${
                cartItems.length === 0
                  ? 'Your shoping cart is empty. <a href="/#/products" class="empty-cart-link">Go back to eshop</a>'
                  : cartItems
                      .map(
                        (item) => `
                  <li>
                    <div class="cart-item-image-container">
                      <img class="cart-item-image" src="${item.image}">
                    </div>
                    <ul class="cart-item-info-container">
                      <li>
                        <strong>${item.name}</strong>
                      </li>
                      <li>
                        ${item.brand}
                      </li>
                      <li>
                        <strong>$ ${item.price}</strong>
                      </li>
                      <li>
                        Quantity:
                        <select class="quantity-select" id="${item.product}">
                          ${[...Array(item.countInStock).keys()].map((x) =>
                            item.quantity === x + 1
                              ? `<option selected value="${x + 1}">${x + 1}</option>`
                              : `<option value="${x + 1}">${x + 1}</option>`,
                          )}
                        </select>
                      </li>
                      <li>
                        <button type="button" class="delete-btn" id="${item.product}">
                          Remove
                        </button>
                      </li>
                    </ul>
                  </li>
                `,
                      )
                      .join('\n')
              }
          </li>
        </ul>
      </div>
      <div class="cart-page-checkout-container">
          <div class="cart-page-checkout">
              <h4>
              Order total: $ ${cartItems.reduce(
                (item, currentTotal) => item + currentTotal.price * currentTotal.quantity,
                0,
              )}
              </h4>
              <button class="checkout-button fw">
                Proceed checkout
              </button>
          </div>
      </div>
    </div>
    `;
  },
};
export default CartPage;
