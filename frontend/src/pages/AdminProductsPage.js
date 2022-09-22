/* eslint-disable object-curly-newline */
import { createProduct, deleteProduct, getProducts } from '../api';
import { showLoading, hideLoading, rerender, showMessage } from '../utils';

const AdminProductsPage = {
  after_render: () => {
    document
      .getElementById('add-product')
      .addEventListener('click', async () => {
        const data = await createProduct();
        document.location.hash = `/edit-product/${data.product._id}`;
      });

    document.querySelectorAll('.delete-product-btn').forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', async () => {
        showLoading();
        const data = await deleteProduct(deleteBtn.id);
        if (data.error) {
          showMessage(data.error);
        } else {
          rerender(AdminProductsPage);
        }
        hideLoading();
      });
    });

    document.querySelectorAll('.edit-product-btn').forEach((editBtn) => {
      editBtn.addEventListener('click', () => {
        document.location.hash = `/edit-product/${editBtn.id}`;
      });
    });
  },
  render: async () => {
    const products = await getProducts({ searchKeyWord: '' });
    return `
    <div class="admin-dashboard-container">
      <nav class="admin-dashboard-nav">
        <a href="/#/dashboard-orders">Orders</a>
        <a href="/#/dashboard-products" class="active">Products</a>
      </nav>
      <div class="admin-orders-container">
        <h1 class="admin-title">Products</h1>
        <button id="add-product">Add product</button>
        <table class="fl-table">
                  <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>BRAND</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>TYPE</th>
                        <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products
                      .map(
                        (product) => `
                      <tr>
                        <td>${product._id}</td>
                        <td>${product.name}</td>
                        <td>${product.brand}</td>
                        <td>${product.price}$</td>
                        <td>${product.countInStock}</td>
                        <td>${product.type}</td>
                        <td>
                          <button id="${product._id}" class="edit-product-btn">Edit</button>
                          <button id="${product._id}" class="delete-product-btn">Delete</button>
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
export default AdminProductsPage;
