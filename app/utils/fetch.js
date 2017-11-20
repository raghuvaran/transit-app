
// import Ember from 'ember';

function fetch(URL, options) {
  options = Object.assign({  
    // credentials: 'include',
    mode: 'cors',
  }, options);
  if(options.method && ['post', 'patch'].indexOf( options.method.toLowerCase()) !== -1) {
    let headers = new Headers({
      "Content-Type": "application/json",
      // "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    })
    options.headers = headers;
  }
  return window.fetch(URL, options).then(status);
}

function fetchJson(URL, options) {
  return fetch(URL, options).then(res => res.json());
}

function fetchBlob(URL, options) {
  return fetch(URL, options).then(res => res.blob());
}

function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response);
  } else {  
    return Promise.reject(new Error(response.statusText));
  }  
}

function serializeParams(params, prefix){
  let str = [], p;
  for(p in params) {
    if (params.hasOwnProperty(p)) {
      let k = prefix ? prefix : p, v = params[p];
      str.push((v !== null && typeof v === "object") ?
        serializeParams(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

function URLGenerator(baseURL, params){
  return baseURL.endsWith('?') ? baseURL + serializeParams(params) : baseURL + '?' + serializeParams(params)
}

export { fetchJson, fetchBlob, serializeParams, URLGenerator };