const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessToken Repository', () => {
  let fakeUserId
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = {
      email: 'test@email.com',
      name: 'UserName',
      age: 50,
      state: 'state',
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)

    fakeUserId = fakeUser._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update user with the given accessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'val_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
    expect(updatedFakeUser.accessToken).toBe('val_token')
  })

  test('Should return user if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
