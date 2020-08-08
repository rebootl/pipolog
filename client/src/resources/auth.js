import { apiPostRequest, apiGetRequest } from './requests.js'
import { authURL } from './urls.js';

export function loggedIn() {
  if (localStorage.getItem('username')) return true;
  return false;
}

export function getUserName() {
  if (!loggedIn()) return "";
  return localStorage.getItem('username');
}

// use for JWT
export function getAuthHeaderJSON() {
  if (loggedIn()) return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization':  'Bearer ' + localStorage.getItem('access_token')
  };
  return {};
}

export function getAuthHeader() {
  if (loggedIn())
    return {
      'Authorization':  'Bearer ' + localStorage.getItem('access_token')
    };
  return {};
}

export async function login(username, pw) {
  const r = await apiPostRequest(authURL + '/login', {
    username: username,
    password: pw
  });
  // check login login resp.
  if (!r.success) {
    console.log("Login unsuccessful :(");
    return r;
  }
  // store JWT
  //localStorage.setItem('access_token', r.token);
  localStorage.setItem('username', username);
  console.log("Login successful!");
  return r;
}

export async function logout() {
  const r = await apiGetRequest(authURL + '/logout');
  if (!r.success) {
    console.log("Logout unsuccessful :/");
    return r;
  }
  localStorage.removeItem('username');
  // remove JWT
  //localStorage.removeItem('access_token');
  console.log("Logout successful, bye...");
  return r;
}
