import React, { useState } from 'react'

const NewBlogForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmitBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title, author, url
    }
    setTitle('')
    setAuthor('')
    setUrl('')
    onSubmit(newBlog)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmitBlog}>
        <div>
          title:
          <input id='title' onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input id='author'onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input id='url' onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button id='new-blog-button'type='submit'>create</button>
      </form>
    </>
  )
}

export default NewBlogForm