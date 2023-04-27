const LoginRouter = require('./login-router')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const { UnauthorizedError, ServerError } = require('../errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    sut, authUseCaseSpy, emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

describe('Login Router', () => {
  test('Should return 400 if email not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'passwd'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if password not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'test@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if invalid email provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'inv_test@mail.com',
        passwd: 'passwd'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if httpRequest not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if httpRequest body not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCaseSpy with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'test@mail.com',
        password: 'passwd'
      }
    }

    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = await makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'inv_test@mail.com',
        password: 'inv_passwd'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'val_@mail.com',
        password: 'val_passwd'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should call EmailValidator with correct params', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'test@mail.com',
        password: 'passwd'
      }
    }

    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('Should throw if invalid dependencies is provided', async () => {
    const invalid = {}
    const authUseCase = makeAuthUseCase()

    const suts = [].concat(

      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({
        authUseCase: invalid
      }),
      new LoginRouter({
        authUseCase
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: invalid
      })
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'inv__test@mail.com',
          password: 'inv_passwd'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    }
  })

  test('Should throw if dependency throws', async () => {
    const authUseCase = makeAuthUseCase()
    const suts = [].concat(
      new LoginRouter({
        authUseCase: makeAuthUseCaseWithError()
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: makeEmailValidatorWithError()
      })
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'inv__test@mail.com',
          password: 'inv_passwd'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    }
  })
})
