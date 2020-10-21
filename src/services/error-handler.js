function errorHandler(err, _, response) {
  if (typeof err === 'string') {
    // Custom application error
    return response.status(400).json({message: err});
  }

  if (err.name === 'UnauthorizedError') {
    // Jwt authentication error
    return response.status(401).json({message: 'Invalid Token'});
  }

  // Default to 500 server error
  return response.status(500).json({message: err.message});
}

module.exports = errorHandler;
