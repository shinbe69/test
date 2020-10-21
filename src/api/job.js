const {Router} = require('express');
const Job = require('../persistence/job');

const router = new Router();

// Admin Create a new job with post method
router.post('/', async (request, response) => {
  try {
    const {
      title,
      salaryrange,
      description,
      tags,
      company,
      logoURL
    } = request.body;
    if (
      !title ||
      !salaryrange ||
      !description ||
      !tags ||
      !company ||
      !logoURL
    ) {
      return response
        .status(400)
        .json({message: 'All information must be provided!'});
    }

    const para = {
      title,
      salaryrange,
      description,
      tags,
      company,
      logoURL
    };
    const job = await Job.create(para);
    if (!job) {
      return response.status(400).json({message: 'Create job failed!'});
    }

    return response.status(201).json({
      message: 'Create the job successful!',
      job
    });
  } catch (error) {
    console.error(
      `createJob({ title: ${request.body.title} }) >> Error: ${error.stack}`
    );

    response.status(500).json();
  }
});

module.exports = router;
