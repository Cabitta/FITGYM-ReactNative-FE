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
