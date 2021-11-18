const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const { before } = require('lodash')

const api = supertest(app)
const initialBlogs = [
  {
    title: 'Crowfall',
    author: 'John Meyer',
    url: 'crow.com',
    likes: 1
  },
  {
    title: 'Babylon',
    author: 'John Meyer',
    url: 'babylon.com',
    likes: 2
  },
  {
    title: 'Ecllyptic Redo',
    author: 'Sam Wisely',
    url: 'redo.com',
    likes: 5
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('testPass', saltRounds)
  const user = new User({
    username: 'testUser',
    passwordHash: hashedPassword,
    name: 'John'
  })
  const test = await user.save()
  const id = test._id

  const blogs = initialBlogs.map(blog => {return {...blog, user: id}})

  for (let blog of blogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
}, 100000)

describe('when initial blogs are saved', () => {
  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('blogs returned has id property', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  }, 100000)

})

describe('addition of a new blog', () => {
  let token = null
  beforeEach(async () => {
    const creds = {
      username: 'testUser',
      password: 'testPass'
    }
    const result = await api.post('/api/login').send(creds)
    token = result.body.token
  }, 100000)

  test('blog post adds new blog to DB', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Author',
      url: 'test.com',
      likes: 3
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(4)
    delete blogs.body[blogs.body.length - 1].id
    delete blogs.body[blogs.body.length - 1].user
    expect(blogs.body[blogs.body.length - 1]).toEqual(newBlog)
  }, 100000)

  test('blog post with no likes has default of 0', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Author',
      url: 'test.com'
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(4)
    delete blogs.body[blogs.body.length - 1].id
    expect(blogs.body[blogs.body.length - 1].likes).toEqual(0)
  }, 100000)

  test('blog post with no title and url returns 400', async () => {
    const newBlog = {
      author: 'Author',
      likes: 3
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  }, 100000)

  test('blog post with no token returns 401', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Author',
      url: 'test.com'
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
  }, 100000)
})

describe('updating the likes of a blog', () => {
  test('likes of a blog is updated', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[blogs.body.length - 1].id
    const newBlogLikes = {
      likes: 52
    }
    const updatedBlog = await api.put(`/api/blogs/${id}`)
      .send(newBlogLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toEqual(52)
  }, 100000)

  test('updating a non-existing id returns 404 code', async () => {
    const newBlogLikes = {
      likes: 52
    }
    await api.put(`/api/blogs/123qweasdzxc`)
      .send(newBlogLikes)
      .expect(404)
  }, 100000)

  test('invalid likes type returns 400 code', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[blogs.body.length - 1].id
    const newBlogLikes = {
      likes: "qwe"
    }
    await api.put(`/api/blogs/${id}`)
      .send(newBlogLikes)
      .expect(400)
  }, 100000)
})

describe('deleting a blog', () => {
  let token = null
  beforeEach(async () => {
    const creds = {
      username: 'testUser',
      password: 'testPass'
    }
    const result = await api.post('/api/login').send(creds)
    token = result.body.token
  }, 100000)

  test('a blog is deleted', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[blogs.body.length - 1].id

    await api.delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const newBlogs = await api.get('/api/blogs')
    expect(newBlogs.body.length).toEqual(2)
  }, 100000)
})

describe('addition of a new user', () => {
  test('user post adds new user to DB', async () => {
    const newUser = {
      username: 'user',
      password: 'test',
      name: 'Test User',
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(2)
    delete users.body[users.body.length - 1].id
    delete users.body[users.body.length - 1].blogs
    delete newUser.password
    expect(users.body[users.body.length - 1]).toEqual(newUser)
  }, 100000)

  test('user post returns 401 and does not save to db if invalid', async () => {
    const newUser = {
      username: 'us',
      password: 'test',
      name: 'Test User',
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(1)
  }, 100000)
})

afterAll(() => {
  mongoose.connection.close()
})