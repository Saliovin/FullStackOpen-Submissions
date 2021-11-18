const blogsRouter = require('express').Router()
const { truncate } = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id)
    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const blogs = await blog.save()
    user.blogs = user.blogs.concat(blogs._id)
    await user.save()
    response.status(201).json(blogs)
  }
  catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const id = request.params.id
  try {
    const blog = await Blog.findById(id)
    if (blog.user.toString() !== request.user.id) {
      return response.status(401).json({ error: 'Cannot delete blog of another user' })
    }

    blog.deleteOne({})
    response.status(204).end()
  }
  catch (exception) {
    next(exception)
  }

})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const blog = {
    likes: body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true, runValidators: true })

    if (!updatedBlog) {
      response.status(404).send(`${id} is not found`)
    }

    response.json(updatedBlog)
  }
  catch (exception) {
    next(exception)
  }

})

module.exports = blogsRouter