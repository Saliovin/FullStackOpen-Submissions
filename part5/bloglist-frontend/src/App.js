import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notif, setNotif] = useState({ message: null, type: 'successNotif' })

  useEffect(() => {
    refreshBlogs()
    const user = window.localStorage.getItem('user')
    setUser(JSON.parse(user))
  }, [])

  const refreshBlogs = async () => {
    const blogs = await blogService.getAll()
    blogs.sort((firstElem, secondElem) => secondElem.likes - firstElem.likes)
    setBlogs(blogs)
  }

  const createNotif = notif => {
    setNotif(notif)
    setTimeout(() => setNotif({ message: null }), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userResponse = await loginService.login({
        username: username,
        password: password
      })
      setUser(userResponse)
      window.localStorage.setItem('user', JSON.stringify(userResponse))
      createNotif({ message: `Logged in as ${userResponse.name}`, type: 'successNotif' })
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log(exception)
      createNotif({ message: 'Invalid username or password', type: 'failNotif' })
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      setUser(null)
      window.localStorage.removeItem('user')
      setUsername('')
      setPassword('')
      createNotif({ message: 'Logout successfull', type: 'successNotif' })
    }
    catch (exception) {
      console.log(exception)
      createNotif({ message: 'Failed to logout', type: 'failNotif' })
    }
  }

  const handleSubmitBlog = async (newBlog) => {
    try {
      await blogService.addBlog(newBlog, user.token)
      refreshBlogs()
      createNotif({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'successNotif' })
    }
    catch (exception) {
      console.log(exception.response.data)
      createNotif({ message: 'Failed to add blog', type: 'failNotif' })
    }
  }

  const handleLikeBlog = async (blogInfo) => {
    try {
      await blogService.likeBlog(blogInfo.id, blogInfo.likes + 1)
      refreshBlogs()
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const handleDeleteBlog = async (blogInfo) => {
    try {
      if (window.confirm(`Remove blog ${blogInfo.title} by ${blogInfo.author}?`)) {
        await blogService.removeBlog(blogInfo.id, user.token)
        refreshBlogs()
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification notif={notif} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input id='username' value={username} name='Username' type='text' onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input id='password' value={password} name='Password' type='password' onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </>
  )

  const main = () => (
    <>
      <h2>blogs</h2>
      <Notification notif={notif} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Toggleable message='new blog'>
        <NewBlogForm onSubmit={handleSubmitBlog} />
      </Toggleable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} username={user.username} deleteHandler={handleDeleteBlog} likeHandler={handleLikeBlog} />)}
    </>
  )

  return (
    <div>
      {
        !user ?
          loginForm() :
          main()
      }
    </div>
  )
}

export default App