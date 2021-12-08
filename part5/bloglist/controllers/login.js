const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!passwordCorrect || !user) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const acceptedUser = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(acceptedUser, process.env.SECRET)

  response.status(200).json({ token: token, username: user.username, name: user.name })
})

module.exports = loginRouter