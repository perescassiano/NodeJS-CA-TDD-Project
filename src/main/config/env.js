module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/node-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
