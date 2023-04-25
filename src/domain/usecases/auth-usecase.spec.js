const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {}
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return { sut, loadUserByEmailRepositorySpy }
}

// Testando promise
describe('Auth UseCase', () => {
  test('Shoul return null if not email provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should return null if not password provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('test@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Shoulc call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('test@email.com', 'passwd')
    expect(loadUserByEmailRepositorySpy.email).toBe('test@email.com')
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('test@email.com', 'passwd')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUserByEmailRepository has no load() method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('test@email.com', 'passwd')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('inv_test@email.com', 'inv_passwd')
    expect(accessToken).toBe(null)
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('inv_test@email.com', 'passwd')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('test@email.com', 'inv_passwd')
    expect(accessToken).toBeNull()
  })
})
