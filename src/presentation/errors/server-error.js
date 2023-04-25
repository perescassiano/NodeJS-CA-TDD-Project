module.exports = class serverError extends Error {
  constructor () {
    super('Internal error')
    this.name = 'ServerError'
  }
}
