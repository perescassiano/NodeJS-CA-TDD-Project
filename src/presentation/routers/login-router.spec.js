class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe("LoginRouter", () => {
  test("Should return 400 if email not provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: "passwd",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
