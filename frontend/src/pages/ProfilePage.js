/* eslint-disable indent */
import { getMyOrders, update } from '../api';
import { clearUser, getUserInfo, setUserInfo } from '../localStorage';
import { getValidDate, hideLoading, showLoading, showMessage } from '../utils';

const ProfilePage = {
  after_render: () => {
    document.getElementById('signout-button').addEventListener('click', () => {
      clearUser();
      document.location.hash = '/';
    });

    document
      .getElementById('profile-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const data = await update({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
          document.location.hash = '/';
        }
      });
  },
  render: async () => {
    const { name, email } = getUserInfo();
    const orders = await getMyOrders();
    if (!name) {
      document.location.hash = '/';
    }
    return `
      <div class="profile-container">
            <form id="profile-form" class="login-register-form">
                <ul class="items-container">
                    <li>
                      <h1>Profile</h1>
                    </li>
                    <li>
                        <label for="name"></label>
                        <i class="fa-solid fa-user"></i>
                        <input value="${name}" type="name" name="name" id="name"/>
                    </li>
                    <li>
                        <label for="email"></label>
                        <i class="fa-solid fa-at"></i>
                        <input value="${email}" type="email" name="email" id="email"/>
                    </li>
                    <li>
                        <label for="password"></label>
                        <i class="fa-solid fa-lock"></i>
                        <input value="Password" type="password" name="password" id="password"/>
                    </li>
                    <li>
                        <button type="submit" class="submit-button">Update</button>
                    </li>
                    <li>
                        <button type="button" id="signout-button" class="submit-button">Logout</button>
                    </li>
                </ul>
            </form>
            <div class="profile-orders-container">
                <table class="fl-table">
                  <thead>
                    <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orders
                      .map(
                        (order) => `
                      <tr>
                        <td>${order._id}</td>
                        <td>${getValidDate(order.createdAt)}</td>
                        <td>${order.totalPrice}$</td>
                        <td>${order.isPaid}</td>
                        <td>${order.isDelivered}</td>
                        <td>
                          <a href="/#/order/${order._id}">DETAILS</a>
                        </td>
                    </tr>
                      `,
                      )
                      .join('\n')}
                    
                  <tbody>
              </table>
            </div>
        </div>
        `;
  },
};
export default ProfilePage;
