const MongoHelper = require('../helpers/mongo-helper')
// const LoadUserByEmailRepository = require('./load-user-by-email-repository')
// const MissingParamError = require('../../utils/errors/missing-param-error')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    userModel,
    sut
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = {
      email: 'test@email.com',
      name: 'UserName',
      age: 50,
      state: 'state',
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)
    await sut.update(fakeUser._id, 'val_token')

    const updatedFakeUser = await userModel.findOne({ _id: fakeUser._id })
    expect(updatedFakeUser.accessToken).toBe('val_token')
  })

  test('Should throw if no userModel provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')

    const fakeUser = {
      email: 'test@email.com',
      name: 'UserName',
      age: 50,
      state: 'state',
      password: 'hashed_password'
    }

    await userModel.insertOne(fakeUser)

    const promise = sut.update(fakeUser._id, 'val_token')
    expect(promise).rejects.toThrow()
  })

//   test('Should return user if no email is provided', async () => {
//     const { sut } = makeSut()
//     const promise = sut.load()
//     expect(promise).rejects.toThrow(new MissingParamError('email'))
//   })
})
