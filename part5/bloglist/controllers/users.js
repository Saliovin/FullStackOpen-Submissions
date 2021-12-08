const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.password.length < 2) response.status(400).json({ error: "Password length must be at least 3 characters long" })

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      passwordHash: hashedPassword,
      name: body.name
    })

    const newUser = await user.save()
    response.status(201).json(newUser)
  }
  catch (exception) {
    next(exception)
  }

})

module.exports = usersRouter