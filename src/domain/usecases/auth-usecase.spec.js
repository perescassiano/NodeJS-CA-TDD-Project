const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

// Testando promise
describe('Auth UseCase', () => {
  test('Shoul return null if not email provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })

  test('Shoul return null if not password provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('test@email.com')
    expect(promise).rejects.toThrow()
  })
})
