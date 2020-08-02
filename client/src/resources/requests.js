import { getAuthHeader } from './auth.js';

const defaultHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}


function createQueryString(parameterObject) {
  // params can be single params (booleans)
  // key value pairs
  // arrays
  // format:
  // {
  //   limit: 50,
  //   skip: 10,
  //   topics: [ "foo", "news", "blabla" ],
  //   tags: [ "important", "todo" ]
  // }
  let q = "?";
  for (const key of Object.keys(parameterObject)) {
    const value = parameterObject[key];
    if (Array.isArray(value)) {
      for (const v of value) {
        q += encodeURIComponent(key) + "[]="
          + encodeURIComponent(v) + "&";
      }
    } else {
      q += encodeURIComponent(key) + "="
        + encodeURIComponent(value) + "&";
    }
  }
  return q;
}
// test lul
/*console.log(createQueryString({
  limit: 10,
  skip: 5,
  reset: true,
  F: "FFOOFO",
  topics: [ "bobobo", "tutu", "gaga" ],
  tags: [ "HRHRR", "TOHTO", "BOOP" ]
}));*/

export async function apiGetRequest(apiUrl, parameterObject = {},
  header = defaultHeader) {
  const q = createQueryString(parameterObject);
  let response;
  try {
    response = await fetch(apiUrl + q, { headers: header });
  } catch (e) {
    e.code = 'EFETCH';
    console.error(e);
    return { success: false, error: e };
  }
  if (!response.ok) {
    const e = new Error('HTTP error, status = ' + response.status);
    e.code = 'ESERVER';
    console.error(e);
    return { success: false, error: e };
  }
  // if decoding fails it shall throw (and stop exec.)
  const data = await response.json();
  return data;
}

export async function apiPostRequest(apiUrl, params, header=defaultHeader) {
  let response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(params)
    });
  } catch (e) {
    e.code = 'EFETCH';
    console.error(e);
    return { success: false, error: e };
  }
  if (!response.ok) {
    const e = new Error('HTTP error, status = ' + response.status);
    e.code = 'ESERVER';
    console.error(e);
    return { success: false, error: e };
  }
  // if decoding fails it shall throw (and stop exec.)
  const data = await response.json();
  return data;
}

export async function uploadFile(apiUrl, data) {
  const formData = new FormData();
  formData.append('data', data);
  const options = {
    method: 'POST',
    body: formData,
    headers: getAuthHeader()
  };
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const e = new Error('HTTP error, status = ' + response.status);
    e.code = 'ESERVER';
    throw e;
  }
  const resultData = await response.json();
  if (!resultData.success) {
    const e = new Error(resultData);
    console.log(resultData);
    e.code = 'ERESPONSE';
    throw e;
  }
  return resultData;
}

export async function* uploadMultiFilesGenerator(apiUrl, files) {
  const formData = new FormData();
  for (const f of files) {
    formData.append('filedata', f);
  }
  const xhr = new XMLHttpRequest();
  let progress = 0.;
  let done = false;
  let result = {};
  let res = () => {};
  let p = new Promise((r) => res = r);
  const update = () => {
    res();
    p = new Promise((r) => res = r);
  };
  xhr.upload.addEventListener('progress', (e) => {
    progress = (e.loaded / e.total) * 100;
    update();
  });
  xhr.addEventListener('load', (e) => {
    result = xhr.response;
    done = true;
    update();
  });
  xhr.addEventListener('error', (e) => {
    console.log("Error during xhr transfer...", xhr.response);
    done = true;
    update();
  });
  xhr.addEventListener('abort', (e) => {
    console.log("Upload aborted...", xhr.response);
    done = true;
    update();
  });
  xhr.responseType = 'json';
  xhr.open('post', apiUrl);
  xhr.setRequestHeader('Authorization', getAuthHeader()['Authorization']);
  xhr.send(formData);
  while(!done) {
    await p;
    yield {
      progress: progress,
      result: result,
      request: xhr
    };
  }
}
