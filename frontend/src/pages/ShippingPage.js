import Checkout from '../components/checkout';
import { getUserInfo, getShipping, setShipping } from '../localStorage';

const ShippingPage = {
  after_render: () => {
    document
      .getElementById('shipping-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        setShipping({
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          postalCode: document.getElementById('postalCode').value,
          country: document.getElementById('country').value,
        });
        document.location.hash = '/payment';
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }
    const { address, city, postalCode, country } = getShipping();
    return `
    ${Checkout.render({ step1: true, step2: true })}
      <div class="form-container">
            <form id="shipping-form" class="login-register-form">
                <ul class="items-container">
                    <li class="shipping-form-title">
                      <h1>Shipping</h1>
                    </li>
                    <li class="create-product-li">
                        <label for="address">Address</label>
                        <input class="create-input" value="${address}" type="text" name="address" id="address"/>
                    </li>
                    <li class="create-product-li">
                        <label for="City">City</label>
                        <input class="create-input" value="${city}" type="text" name="City" id="city"/>
                    </li>
                    <li class="create-product-li">
                        <label for="postalCode">Postal code</label>
                        <input class="create-input" value="${postalCode}" type="text" name="postalCode" id="postalCode"/>
                    </li>
                    <li class="create-product-li">
                        <label for="country">Country</label>
                        <input class="create-input" value="${country}" type="text" name="country" id="country"/>
                    </li>
                    <li class="shipping-button-container">
                        <button type="submit" class="submit-button">Continue</button>
                    </li>
                </ul>
            </form>
        </div>
        `;
  },
};
export default ShippingPage;
