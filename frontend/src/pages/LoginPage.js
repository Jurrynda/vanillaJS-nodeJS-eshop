import { signin } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { hideLoading, redirectUser, showLoading, showMessage } from '../utils';

const LoginPage = {
  after_render: () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      showLoading();
      const data = await signin({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      });
      hideLoading();
      if (data.error) {
        // eslint-disable-next-line no-alert
        showMessage(data.error);
      } else {
        setUserInfo(data);
        redirectUser();
      }
    });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
      <div class="form-container">
            <form id="login-form" class="login-register-form">
                <ul class="items-container">
                    <li>
                        <h1>Sign in</h1>
                    </li>
                    <li>
                        <label for="email"></label>
                        <i class="fa-solid fa-user"></i>
                        <input placeholder="E-mail" type="email" name="email" id="email"/>
                    </li>
                    <li>
                        <label for="password"></label>
                        <i class="fa-solid fa-lock"></i>
                        <input placeholder="Password" type="password" name="password" id="password"/>
                    </li>
                    <li>
                        <button type="submit" class="submit-button">Sign in</button>
                    </li>
                    <li>
                        <span>Dont have acount?</span>
                        <a href="/#/register">Sign-up Now</a>
                    </li>
                </ul>
            </form>
        </div>
        `;
  },
};
export default LoginPage;
