import { register } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import {
  hideLoading, redirectUser, registerCheck, showLoading, showMessage,
} from '../utils';

const RegisterPage = {
  after_render: () => {
    document.getElementById('register-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const userName = document.getElementById('name').value;
        const userEmail = document.getElementById('email').value;
        const password1 = document.getElementById('password').value;
        const password2 = document.getElementById('repassword').value;
        if (registerCheck(userName, userEmail, password1, password2) === true) {
          showLoading();
          const data = await register({
            name: userName,
            email: userEmail,
            password: password1,
          });
          hideLoading();
          if (data.error) {
            // eslint-disable-next-line no-alert
            showMessage(data.error);
          } else {
            setUserInfo(data);
            redirectUser();
          }
          hideLoading();
        }
      });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
      <div class="form-container">
            <form id="register-form" class="login-register-form">
                <ul class="items-container">
                    <li>
                        <h1>Register</h1>
                    </li>
                    <li>
                        <label for="name"></label>
                        <i class="fa-solid fa-user"></i>
                        <input placeholder="Name" type="name" name="name" id="name"/>
                    </li>
                    <li>
                        <label for="email"></label>
                        <i class="fa-solid fa-at"></i>
                        <input placeholder="E-mail" type="email" name="email" id="email"/>
                    </li>
                    <li>
                        <label for="password"></label>
                        <i class="fa-solid fa-lock"></i>
                        <input placeholder="Password" type="password" name="password" id="password"/>
                    </li>
                    <li>
                        <label for="repassword"></label>
                        <i class="fa-solid fa-lock"></i>
                        <input placeholder="Password" type="password" name="repassword" id="repassword"/>
                    </li>
                    <li>
                        <button type="submit" class="submit-button">Register</button>
                    </li>
                    <li>
                      <span>Already have an acount?</span>
                      <a href="/#/login">Sign-in Now</a>
                    </li>
                </ul>
            </form>
        </div>
        `;
  },
};
export default RegisterPage;
