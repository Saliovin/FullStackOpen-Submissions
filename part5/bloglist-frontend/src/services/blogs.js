import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = async (blog, token) => {
  return await axios.post(baseUrl, blog, { headers: { 'Authorization': `Bearer ${token}` } })
}

const likeBlog = async (id, likes) => {
  return await axios.put(`${baseUrl}/${id}`, { likes: likes })
}

const removeBlog = async (id, token) => {
  return await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
}

export default { getAll, addBlog, likeBlog, removeBlog }