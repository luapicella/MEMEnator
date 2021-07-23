/**
 * All the API calls
 */

const BASEURL = '/api';


function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyze the cause of error
          response.json()
            .then(obj => reject(obj)) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => reject({ error: "Cannot communicate" })) // connection error
  });
}


function getMemeList() {
  // call: GET /api/memes
  return getJson(
    fetch(BASEURL + '/memes')
  ).then(json => {
    return json.map((meme) => ({ id: meme.id, title: meme.title }));
  })
}

function getPublicMemes() {
  // call: GET /api/memes/public
  return getJson(
    fetch(BASEURL + '/memes/public')
  ).then(json => {
    return json;
  })
}

function getMemes() {
  // call: GET /api/memes/<id>
  return getJson(
    fetch(BASEURL + '/memes')
  ).then(json => {
    return json;
  })
}

function getMemePublic(memeID) {
  // call: GET /api/memes/public/<id>
  return getJson(
    fetch(BASEURL + '/memes/public/' + memeID)
  ).then(json => {
    return json;
  })
}

function getImages() {
  // call: GET /api/images
  return getJson(
    fetch(BASEURL + '/images/')
  ).then(json => {
    return json;
  })
}

function getImage(imageID) {
  // call: GET /api/images/<id>
  return getJson(
    fetch(BASEURL + '/images/' + imageID)
  ).then(json => {
    return json;
  })
}

function addMeme(meme) {
  // call: POST /api/memes
  return getJson(
    fetch(BASEURL + "/memes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meme)
    })
  )
}

function deleteMeme(memeID) {
  // call: DELETE /api/memes/<id>
  return getJson(
    fetch(BASEURL + '/memes/' + memeID, {
      method: 'DELETE'
    })
  )
}

async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}

const API = { getMemeList, getMemes, getPublicMemes, getImages, getImage, addMeme, deleteMeme, logIn, logOut, getUserInfo };
export default API;