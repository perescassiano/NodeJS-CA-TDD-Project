const { MongoClient } = require('mongodb')

let client, db

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({
      email
    }, {
      projection: {
        password: 1
      }
    })
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return { userModel, sut }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('inv_test@email.com')
    expect(user).toBeNull()
  })

  test('Should return user if  user is found', async () => {
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
})
