import { ALERT_MESSAGE } from '../constants.js';

const fetchSignup = async (url, option) => {
  const response = await fetch(url, option);
  if (response.status === 400) {
    throw new Error(ALERT_MESSAGE.DUPLICATED_EMAIL_FAIL);
  }

  if (!response.ok) {
    throw new Error(response.status);
  }
};

const fetchLogin = async (url, option) => {
  const response = await fetch(url, option);
  if (response.status === 400) {
    throw new Error(ALERT_MESSAGE.LOGIN_FAIL);
  }

  if (!response.ok) {
    throw new Error(response.status);
  }
};

export { fetchSignup, fetchLogin };