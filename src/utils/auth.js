export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    return res
  })
  .catch((err) => {
    return console.log(err)
  })
};

export const authorize = ({ email, password }) => {
  return fetch(`${ BASE_URL }/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      return data;
    }
      return data
  })
  .catch((err) => {
    return console.log(err)
  })
};

export const getInfoLogin = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then((res) => {
    return res.json()
  })
  .then(({ data }) => {
    return (data)
  })
  .catch((err) => {
    return console.log(err)
  })
};