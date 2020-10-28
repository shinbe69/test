const {Router} = require('express');
const Job = require('../persistence/job');
const uuid = require('uuid');
const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {
      title,
      salaryRange,
      description,
      tags,
      company,
      logoURL
    } = request.body;
    if (
      !title ||
      !salaryRange ||
      !description ||
      !tags ||
      !company ||
      !logoURL
    ) {
      return response
        .status(400)
        .json({message: 'All information must be provided!'});
    }

    const jobParameters = {
      title,
      salaryRange,
      description,
      tags,
      company,
      logoURL
    };
    const job = await Job.create(jobParameters);
    if (!job) {
      return response.status(400).json({message: 'Create job failed!'});
    }

    return response
      .status(201)
      .json({message: 'Create the job successful!', job});
  } catch (error) {
    console.error(
      `createJob({ title: ${request.body.title} }) >> Error: ${error.stack}`
    );

    response.status(500).json();
  }
});

router.put('/', async (request, response) => {
  try {
    const {id} = request.body;
    if (uuid.validate(id)) {
      // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
      let job = await Job.find(id);
      if (job) {
        const jobParameters = request.body;
        job = await Job.update(job, jobParameters);
        if (!job) {
          return response.status(400).json({message: 'Update job failed!'});
        }

        return response.status(200).json({
          message: 'Update the job successful!',
          job
        });
      }
    }

    return response
      .status(400)
      .json({message: 'There is no job with this id!'});
  } catch (error) {
    console.error(
      `updateJob({ title: ${request.body.title} }) >> Error: ${error.stack}`
    );

    response.status(500).json();
  }
});
module.exports = router;
