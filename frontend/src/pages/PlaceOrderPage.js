/* eslint-disable indent */
import Checkout from '../components/checkout';
import {
  cleanCart, getCartItems, getPayment, getShipping,
} from '../localStorage';
import { showLoading, hideLoading, showMessage } from '../utils';
import { createOrder } from '../api';

const convertCartToOrder = () => {
  const orderItems = getCartItems();
  if (orderItems.length === 0) {
    document.location.hash = '/cart';
  }
  const shipping = getShipping();
  if (!shipping.address) {
    document.location.hash = '/placeorder';
  }
  const payment = getPayment();
  if (!payment.paymentMethod) {
    document.location.hash = '/payment';
  }
  const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  return {
    orderItems,
    shipping,
    payment,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
const PlaceOrderPage = {
  after_render: async () => {
    document.getElementById('placeorder-button')
      .addEventListener('click', async () => {
        const order = convertCartToOrder();
        showLoading();
        const data = await createOrder(order);
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          cleanCart();
          document.location.hash = `/order/${data.order._id}`;
        }
      });
  },
  render: () => {
    const {
      orderItems,
      shipping,
      payment,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = convertCartToOrder();
    return `
    <div>
      ${Checkout.render({
        step1: true,
        step2: true,
        step3: true,
        step4: true,
      })}
      <div class="placeorder">
        <div class="order-info">
          <div class="order-info-container">
            <h2>Shipping</h2>
            <div>
                <p>${shipping.address}</p>
                <p>${shipping.city}</p>
                <p>${shipping.postalCode}</p>
                <p>${shipping.country}</p>
            </div>
          </div>
          <div class="order-info-container">
            <h2>Payment</h2>
            <div>
              Payment Method : ${payment.paymentMethod}
            </div>
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Shopping Cart</h2>
              </li>
              ${orderItems
                .map(
                  (item) => `
                <li>
                  <div class="cart-item-image-container">
                    <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
                  </div>
                  <div class="cart-name">
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
                            Quantity: ${item.quantity}
                        </li>
                    </ul>
                </li>
                `,
                )
                .join('\n')}
            </ul>
          </div>
        </div>
        <div class="order-action">
           <ul>
                <li>
                  <h2>Order Summary</h2>
                 </li>
                 <li>Items: $${itemsPrice}</li>
                 <li>Shipping: $${shippingPrice}</li>
                 <li>Tax: $${taxPrice}</li>
                 <li class="total">Order Total: $${totalPrice}</li> 
                 <li>
                 <button id="placeorder-button" class="placeorder-button fw">
                    Place Order
                 </button>
            </ul>
        </div>
      </div>
    </div>
    `;
  },
};
export default PlaceOrderPage;
