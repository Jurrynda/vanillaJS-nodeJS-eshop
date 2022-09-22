import { deleteOrder, getAllOrders } from '../api';
import {
  getValidDate,
  hideLoading,
  rerender,
  showLoading,
  showMessage,
} from '../utils';

const AdminOrdersPage = {
  after_render: () => {
    document.querySelectorAll('.orders-delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        showLoading();
        const data = await deleteOrder(btn.id);
        if (data.error) {
          showMessage(data.error);
        } else {
          rerender(AdminOrdersPage);
        }
        hideLoading();
      });
    });

    document.querySelectorAll('.orders-edit-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        document.location.hash = `/order/${btn.id}`;
      });
    });
  },
  render: async () => {
    const orders = await getAllOrders();
    return `
    <div class="admin-dashboard-container">
      <nav class="admin-dashboard-nav">
        <a href="/#/dashboard-orders" class="active">Orders</a>
        <a href="/#/dashboard-products">Products</a>
      </nav>
      <div class="admin-orders-container">
        <h1>Orders</h1>
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
                          <button class="orders-edit-btn" id="${
                            order._id
                          }">Edit</button>
                          <button class="orders-delete-btn" id="${
                            order._id
                          }">Delete</button>
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
export default AdminOrdersPage;
