import { apiPostRequest } from './requests.js'
import { loginURL } from './urls.js';
//import { imagestore } from './imagestore.js';

export function loggedIn() {
  if (localStorage.getItem('access_token')) return true;
  return false;
}

export function getUserName() {
  if (!loggedIn()) return "";
  return localStorage.getItem('username');
}

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
  const r = await apiPostRequest(loginURL, {
    username: username,
    password: pw
  });
  // check login login resp.
  if (!r.success) {
    console.log("Login unsuccessful :(");
    return r;
  }
  console.log("Login successful!");
  // store JWT
  localStorage.setItem('access_token', r.token);
  localStorage.setItem('username', username);
  return r;
}

export async function logout() {
  localStorage.removeItem('username');
  localStorage.removeItem('access_token');
  // delete locally stored images
  //imagestore.cleanupLocalStorage();
  //api.headers = {};
  //await api.reset();
}
