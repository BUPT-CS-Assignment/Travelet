function set_user_name(username) {
  localStorage.setItem('username', username);
}

function get_user_name() {
  return localStorage.getItem('username')
}

function get_user_id() {
  return localStorage.getItem('userid');
}

function set_user_id(uid) {
  localStorage.setItem('userid', uid);
}


function get(url, param = {}, identifier = null) {
  if(param == null) param = {}

  return new Promise((resolve, reject) => {
    if(identifier && param) {
      param[identifier] = get_user_id();
    }

    var params = ''
    for(let key in param)
      params += (key + '=' + param[key] + '&')
    params = params.slice(0, -1)

    var url_encode = url + (params.length > 0 ? ('?' + params) : '');
    url_encode = encodeURI(url_encode)

    fetch(url_encode)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      resolve(data)
    })
    .catch(err => {
      console.log(err)
      alert(err)
    })
  })
}


const JOSN_HEADER = {
  'Content-Type': 'application/json'
}
function post(url, data, identifier = null, json = true, headers = {}) {
  return new Promise((resolve, reject) => {
    if(identifier) {
      const user_id = String(get_user_id());
      if(user_id == null) reject('Not logged in')
      data[String(identifier)] = user_id;
    }

    fetch(url, {
      method: 'POST',
      headers: json ? JOSN_HEADER : headers,
      body: json ? JSON.stringify(data) : data
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      resolve(data)
    })
    .catch(err => {
      console.log(err)
      alert(err)
    })
  })
}

export {get, post, set_user_id, get_user_id, set_user_name, get_user_name}