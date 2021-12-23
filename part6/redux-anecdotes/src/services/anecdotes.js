import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async anecdote => {
  const newAnecdote = {
    content: anecdote,
    votes: 0
  }
  const response = await axios.post(baseUrl, newAnecdote)

  return response.data
}

const voteAnecdote = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const anecdote = response.data
  return await axios.put(`${baseUrl}/${id}`, {...anecdote, votes: anecdote.votes + 1}).data
}

export default { getAll, createNew, voteAnecdote }