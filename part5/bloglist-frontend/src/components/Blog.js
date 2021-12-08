import React, { useState } from 'react'

const Blog = ({ blog, username, deleteHandler, likeHandler }) => {
  const [expandedView, setExpandedView] = useState(false)

  return (
    <div className='blogPost'>
      {blog.title} {blog.author}
      <button
        style={{ display: expandedView ? 'none' : '' }}
        onClick={() => setExpandedView(!expandedView)}>
        view
      </button>
      <button
        style={{ display: expandedView ? '' : 'none' }}
        onClick={() => setExpandedView(!expandedView)}>
        hide
      </button>
      <div style={{ display: expandedView ? '' : 'none' }} className='blogPostExtended'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => likeHandler(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === username ?
          <button onClick={() => deleteHandler(blog)}>remove</button> :
          <></>
        }

      </div>
    </div>
  )
}

export default Blog