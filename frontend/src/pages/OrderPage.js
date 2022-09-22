/* eslint-disable no-use-before-define */
/* eslint-disable indent */
import {
  hideLoading,
  parseRequestUrl,
  rerender,
  showLoading,
  showMessage,
} from '../utils';
import { deliverOrder, getOrder, getPayPalClientId, payOrder } from '../api';
import { getUserInfo } from '../localStorage';

const addPaypalSdk = async (totalPrice) => {
  const clientId = await getPayPalClientId();
  showLoading();
  if (!window.paypal) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypalobjects.com/api/checkout.js';
    script.async = true;
    script.onload = () => handlePayment(clientId, totalPrice);
    document.body.appendChild(script);
  } else {
    handlePayment(clientId, totalPrice);
  }
};
const handlePayment = (clientId, totalPrice) => {
  window.paypal.Button.render(
    {
      env: 'sandbox',
      client: {
        sandbox: clientId,
        production: '',
      },
      locale: 'en_US',
      style: {
        size: 'responsive',
        color: 'gold',
        shape: 'pill',
      },

      commit: true,
      payment(data, actions) {
        return actions.payment.create({
          transactions: [
            {
              amount: {
                total: totalPrice,
                currency: 'USD',
              },
            },
          ],
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.execute().then(async () => {
          showLoading();
          await payOrder(parseRequestUrl().id, {
            orderID: data.orderID,
            payerID: data.payerID,
            paymentID: data.paymentID,
          });
          hideLoading();
          showMessage('Payment was successfull.', () => {
            rerender(OrderPage);
          });
        });
      },
    },
    '#paypal-button',
  ).then(() => {
    hideLoading();
  });
};
const OrderPage = {
  after_render: async () => {
    const request = parseRequestUrl();
    document
      .getElementById('order-deliver-btn')
      .addEventListener('click', async () => {
        showLoading();
        await deliverOrder(request.id);
        hideLoading();
        showMessage('Order delivered');
        rerender(OrderPage);
      });
  },
  render: async () => {
    const { isAdmin } = getUserInfo();
    const request = parseRequestUrl();
    const {
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
    if (!isPaid) {
      addPaypalSdk(totalPrice);
    }
    return `
    <div>
      <div class="placeorder">
        <div class="order-info">
          <div class="order-info-container">
            <h2>Shipping</h2>
            <div>
                <p>Address: ${shipping.address}</p>
                <p>City: ${shipping.city}</p>
                <p>Postal code: ${shipping.postalCode}</p>
                <p>Country: ${shipping.country}</p>
                ${
                  isDelivered
                    ? `<p class="sucess">Delivered at ${deliveredAt}</p>`
                    : '<p class="error">Not delivered</p>'
                }
            </div>
          </div>
          <div class="order-info-container">
            <h2>Payment</h2>
            <div>
              Payment Method : ${payment.paymentMethod}
              ${
                isPaid
                  ? `<p class="sucess">Paid at ${paidAt}</p>`
                  : '<p class="error">Not paid</p>'
              }
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
                    <div class="fw" id="paypal-button"></div>
                 </li>
                 <li>
                  ${
                    isPaid && !isDelivered && isAdmin
                      ? '<button class="fw" class="send-order-btn" id="order-deliver-btn">Deliver order</button>'
                      : '<div></div>'
                  }
                 </li>
            </ul>
        </div>
      </div>
    </div>
    `;
  },
};
export default OrderPage;
