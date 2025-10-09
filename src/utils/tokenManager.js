// Simple in-memory token cache to avoid race conditions between
// storing the token (async) and the first network requests.
let currentToken = null;

export default {
  setToken(token) {
    currentToken = token;
  },
  getToken() {
    return currentToken;
  },
  clear() {
    currentToken = null;
  },
};
