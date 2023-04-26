class LoadUserByEmailRepository {
  async load () {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  test('Should return null if no user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load('inv_test@email.com')
    expect(user).toBeNull()
  })
})
