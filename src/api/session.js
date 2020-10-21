const {Router} = require('express');

const sessionService = require('../services/session');

const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {email, password} = request.body;
    const user = await sessionService.authenticate(email, password);

    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `Cannot login ({ email: ${request.body.email} }) >> ${error.stack})`
    );

    return response.status(500).json();
  }
});

module.exports = router;
