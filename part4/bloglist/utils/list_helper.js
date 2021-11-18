const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  // blogs.reduce((currentHighest, blog) => {
  //   if (blog.likes > currentHighest.likes) return blog
  //   return currentHighest
  // }, blogs[0])
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
  return total
}

const favoriteBlog = blogs => {
  const favoriteBlog = blogs.reduce((currentHighest, blog) => {
    if (blog.likes > currentHighest.likes) return blog
    return currentHighest
  }, blogs[0])
  return favoriteBlog ? favoriteBlog : {}
}

const mostBlogs = blogs => {
  const groupedBlogs = lodash.groupBy(blogs, blog => blog.author)
  const mostBlogs = lodash.maxBy(Object.keys(groupedBlogs), author => groupedBlogs[author].length)
  return mostBlogs
    ? {
      author: mostBlogs,
      blogs: groupedBlogs[mostBlogs].length
    }
    : {}
}

const mostLikes = blogs => {
  const groupedBlogs = lodash.groupBy(blogs, blog => blog.author)
  const authorsByLikes = lodash.map(Object.keys(groupedBlogs), author => {
    return {
      author: author,
      likes: totalLikes(groupedBlogs[author])
    }
  })
  return authorsByLikes.length > 0
    ? lodash.maxBy(authorsByLikes, author => author.likes)
    : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}