const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('value', 'hashed-value')
    expect(isValid).toBe(true)
  })

  test('Should return false if bcrypt returns true', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('value', 'hashed-value')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('a-value', 'hashed-value')
    expect(bcrypt.value).toBe('a-value')
    expect(bcrypt.hash).toBe('hashed-value')
  })

  test('Should throw no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('a-value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
