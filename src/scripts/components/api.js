const BASE_URL = "https://mesto.nomoreparties.co/v1/apf-cohort-203";

const AUTH_TOKEN = "7f133852-018b-44bd-a3ba-6af3cf4a92ce";

const defaultHeaders = {
  authorization: AUTH_TOKEN,
  "Content-Type": "application/json",
};

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(`Server error: ${response.status}`);
  }
  return response.json();
}

function request(endpoint, options = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...options,
  }).then(handleResponse);
}

export function getUserInfo() {
  return request("/users/me");
}

export function getInitialCards() {
  return request("/cards");
}

export function updateUserInfo(name, about) {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
}

export function updateAvatar(avatar) {
  return request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
}

export function addNewCard(name, link) {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
}

export function deleteCardFromServer(cardId) {
  return request(`/cards/${cardId}`, {
    method: "DELETE",
  });
}

export function likeCardOnServer(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: "PUT",
  });
}

export function unlikeCardOnServer(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: "DELETE",
  });
}
