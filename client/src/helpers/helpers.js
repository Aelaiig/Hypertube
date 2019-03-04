import Validator from 'validator';

export default {
  validateEmail: (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePassword: (password) => {
    if ((password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)) == null) {
      return false;
    }
    return true;
  },
  parseToken() {
    if (!localStorage.getItem('user-token')) throw new Error('Token not available');
    return JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('user-token').split('.')[1]))));
  },
};
