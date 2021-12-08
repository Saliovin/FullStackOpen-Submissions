const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

const tokenHandler = (request, response, next) => {
  const token = request.get('Authorization')
  if (token && token.toLowerCase().startsWith('bearer '))
    request.token = token.substring(7)
  else request.token = null
  next()
}

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Token is missing of invalid' })
  }
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token is missing of invalid' })
  }

  request.user = decodedToken
  next()
}
module.exports = { errorHandler, tokenHandler, userExtractor }