const {Router} = require('express');
const Job = require('../persistence/job');

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
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const isJobExist = await Job.find(id);
    if (!isJobExist) {
      return response
        .status(400)
        .json({message: 'There is no job with this id!'});
    }

    const jobParameters = request.body;
    const job = await Job.update(isJobExist, jobParameters);
    if (!job) {
      return response.status(400).json({message: 'Update job failed!'});
    }

    return response.status(200).json({
      message: 'Update the job successful!',
      job
    });
  } catch (error) {
    console.error(
      `updateJob({ title: ${request.body.title} }) >> Error: ${error.stack}`
    );

    response.status(500).json();
  }
});
module.exports = router;
