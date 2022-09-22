import { getProduct, updateProduct, uploadProductImage } from '../api';
import {
  hideLoading,
  parseRequestUrl,
  showLoading,
  showMessage,
} from '../utils';

const ProductEditPage = {
  after_render: () => {
    const request = parseRequestUrl();

    document
      .getElementById('create-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const data = await updateProduct({
          _id: request.id,
          brand: document.getElementById('product-brand').value,
          name: document.getElementById('product-name').value,
          type: document.getElementById('product-type').value,
          image: document.getElementById('product-image-text').value,
          countInStock: document.getElementById('product-count').value,
          price: document.getElementById('product-price').value,
        });

        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          document.location.hash = '/dashboard-products';
        }
      });

    document
      .getElementById('product-image')
      .addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        showLoading();
        const data = await uploadProductImage(formData);
        console.log(data);
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          document.getElementById('product-image-text').value = data.image;
          showMessage('Image uploaded');
          console.log(document.getElementById('product-image-text').value);
        }
      });

    document
      .querySelector('.product-edit-angle')
      .addEventListener('click', () => {
        document.location.hash = '/dashboard-products';
      });
  },
  render: async () => {
    const request = parseRequestUrl();
    const product = await getProduct(request.id);
    return `
      <div class="form-container">
            <form id="create-form" class="login-register-form">
                <ul class="items-container">
                    <li class="create-product-li-title">
                        <i class="fa-solid fa-angle-left product-edit-angle"></i>
                        <h1>Create product</h1>
                    </li>
                    <li class="create-product-li">
                        <label for="product-brand">Brand</label>
                        <input class="create-input" type="text" id="product-brand" value="${product.brand}"/>
                    </li>
                    <li class="create-product-li">
                        <label for="product-name">Name</label>
                        <input class="create-input" type="text" id="product-name" value="${product.name}"/>
                    </li>
                    <li class="create-product-li">
                        <label for="product-type">Category</label>
                        <input class="create-input" type="text" id="product-type" value="${product.type}"/>
                    </li>
                    <li class="create-product-li">
                        <label for="product-count">Quantity</label>
                        <input class="create-input" type="text" id="product-count" value="${product.countInStock}"/>
                    </li>
                    <li class="create-product-li">
                        <label for="product-price">Price</label>
                        <input class="create-input" type="text" id="product-price" value="${product.price}"/>
                    </li>
                    <li class="create-product-li">
                        <label for="product-image">Image</label>
                        <input type="text" class="create-input" id="product-image-text" value="${product.image}"></input>
                        <input class="create-input" type="file" id="product-image"/>
                    </li>
                    <li>
                        <button type="submit" class="submit-button">Create</button>
                    </li>
                </ul>
            </form>
        </div>
        `;
  },
};
export default ProductEditPage;
