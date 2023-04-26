const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return { userModel, sut }
}

describe('LoadUserByEmail Repository', () => {
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

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('inv_test@email.com')
    expect(user).toBeNull()
  })

  test('Should throw if no userModel provided', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = {
      email: 'test@email.com',
      name: 'UserName',
      age: 50,
      state: 'state',
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)

    const user = await sut.load('test@email.com')

    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })
  test('Should return user if  user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('test@email.com')
    expect(promise).rejects.toThrow()
  })
})
