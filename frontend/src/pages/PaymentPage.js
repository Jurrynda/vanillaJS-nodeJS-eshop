import Checkout from '../components/checkout';
import { getUserInfo, setPayment } from '../localStorage';

const PaymentPage = {
  after_render: () => {
    document
      .getElementById('payment-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const paymentMethod = document.querySelector(
          'input[name="payment-method"]:checked',
        ).value;
        setPayment({ paymentMethod });
        document.location.hash = '/placeorder';
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = '/placeorder';
    }

    return `
    ${Checkout.render({ step1: true, step2: true, step3: true })}
      <div class="form-container">
            <form id="payment-form" class="payment-form">
                <ul class="items-container">
                    <li>
                      <h1>Payment</h1>
                    </li>
                    <li class="radio-input">
                      <div>
                        <input type="radio"
                        name="payment-method"
                        id="paypal"
                        value="Paypal"
                        checked/>
                        <label for="paypal">PayPal</label>
                      </div>
                    </li>
                    <li class="radio-input">
                      <div>
                        <input type="radio"
                        name="payment-method"
                        id="visa"
                        value="Visa"
                        disabled
                        />
                        <label for="visa" id="visa-label">Visa</label>
                      </div>
                    </li>
                    <li>
                        <button type="submit" class="submit-button">Continue</button>
                    </li>
                </ul>
            </form>
        </div>
        `;
  },
};
export default PaymentPage;
