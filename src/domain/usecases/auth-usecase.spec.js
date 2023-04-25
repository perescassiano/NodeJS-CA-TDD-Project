const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
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
})
