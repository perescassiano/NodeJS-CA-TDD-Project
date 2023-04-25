module.exports = {
  token: 'a_token',
  sign (id, secret) {
    return this.token
  }
}
