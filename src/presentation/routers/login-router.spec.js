const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
describe('Login Router', () => {
  it('Should return 400 if email not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'passwd'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if password not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'tes@mail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if httpRequest not provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest body not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
