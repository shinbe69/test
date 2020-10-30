const expressJwt = require('express-jwt');
const config = require('../../config');

module.exports = jwt;

function jwt() {
  const {SECRET} = config;
  return expressJwt({secret: SECRET, algorithms: ['HS256']}).unless({
    path: [
      // Public routes that don't require authentication
      '/api/sessions',
      '/api/health',
      {url: '/api/jobs', methods: ['GET']}
    ]
  });
}
