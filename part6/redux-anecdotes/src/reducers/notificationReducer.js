export const setNotification = (content, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      content
    })
    const timeoutId = setTimeout(() =>
      dispatch({
        type: 'SET_NOTIFICATION',
        content: null
      })
      , timeout)
    dispatch({
      type: 'SET_TIMEOUT_ID',
      timeoutId
    })
  }
}

const reducer = (state = { content: '', timeoutId: '' }, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        ...state,
        content: action.content
      }
    case 'SET_TIMEOUT_ID':
      clearTimeout(state.timeoutId)
      return {
        ...state,
        timeoutId: action.timeoutId
      }
    default:
      return state
  }
}

export default reducer