/* eslint-disable no-plusplus */
/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
import { getCartItems } from './localStorage';

export const parseRequestUrl = () => {
  const address = document.location.hash.slice(1).split('?')[0];
  const queryString =
    document.location.hash.slice(1).split('?').length === 2
      ? document.location.hash.slice(1).split('?')[1]
      : '';

  const url = address.toLowerCase();
  const r = url.split('/');
  const q = queryString.split('=');
  return {
    resource: r[1],
    id: r[2],
    action: r[3],
    name: q[0],
    value: q[1],
  };
};
export const rerender = async (component) => {
  document.getElementById('main').innerHTML = await component.render();
  await component.after_render();
};

export const showLoading = () => {
  document.getElementById('loading-overlay').classList.add('active');
};

export const hideLoading = () => {
  document.getElementById('loading-overlay').classList.remove('active');
};

export const getValidDate = (date) => {
  const oldDate = date.split('T');
  const newDate = oldDate[0];
  const time = oldDate[1].split('.')[0];
  return `${newDate} <br> ${time}`;
};

export const showMessage = (message, callback) => {
  document.getElementById('message-overlay').innerHTML = `
  <div>
    <div id="message-overlay-content">${message}</div>
    <button id="message-overlay-close-button">OK</button>
  </div>
  `;
  document.getElementById('message-overlay').classList.add('active');
  document
    .getElementById('message-overlay-close-button')
    .addEventListener('click', () => {
      document.getElementById('message-overlay').classList.remove('active');
      if (callback) {
        callback();
      }
    });
};

export const redirectUser = () => {
  if (getCartItems().length !== 0) {
    document.location.hash = '/shipping';
  } else {
    document.location.hash = '/products';
  }
};

export const registerCheck = (name, email, password1, password2) => {
  const checkUppercase = (str) => {
    for (let i = 0; i < str.length; i++) {
      if (
        str.charAt(i) === str.charAt(i).toUpperCase() &&
        str.charAt(i).match(/[a-z]/i)
      ) {
        return true;
      }
    }
    return false;
  };
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (name.length < 4) {
    showMessage('Name has to contain at least 4 characters.');
    return false;
  }
  if (/\d/.test(name)) {
    showMessage('Name cannot contain numbers.');
    return false;
  }
  if (!re.test(email)) {
    showMessage('That is invalid email adress.');
    return false;
  }
  if (password1 !== password2) {
    showMessage('Passwords does not match.');
    return false;
  }
  if (!checkUppercase(password1) || /\d/.test(password1) === false) {
    showMessage(
      'Password must contain at least one capital letter and number.',
    );
    return false;
  }
  if (password1.length < 8) {
    showMessage('Password must contain at least 8 characters.');
    return false;
  }
  return true;
};
