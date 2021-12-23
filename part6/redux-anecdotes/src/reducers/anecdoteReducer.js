import anecdoteService from "../services/anecdotes"

export const voteAnecdote = id => {
  return async dispatch => {
    await anecdoteService.voteAnecdote(id)
    dispatch({
      type: 'VOTE',
      data: {
        id
      }
    })
  }
}

export const newAnecdote = anecdote => {
  return async dispatch => {
    const createdAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: {
        anecdote: createdAnecdote
      }
    })
  }
}

export const initAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToVote = state.find(e => e.id === id)
      const changedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      return state.map(e => e.id === id ? changedAnecdote : e).sort((firstElem, secondElem) => secondElem.votes - firstElem.votes)
    case 'NEW_ANECDOTE':
      const anecdote = action.data.anecdote
      return state.concat(anecdote)
    case 'INIT_ANECDOTES':
      return action.data.sort((firstElem, secondElem) => secondElem.votes - firstElem.votes)
    default:
      return state
  }
}

export default reducer