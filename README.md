# Job board API - Onboarding project

### Definition of Done (DoD)

One feature is done if it meets all these conditions:
- Completed all requirements for that feature. 
- Covered by unit tests.
- Deployed to a server for users to use it.

### Requirements
This is the API project to allow admin user to create, edit, update, delete a job and normal users can fetch all the jobs.

You can find all tickets on the [project board](https://github.com/fabatek/onboarding-job-board-api/projects). We sorted all the tickets by order, so you need to complete all the tickets one by one. Please take a look at DoD above to see how we define a completed ticket.

### Recommended technologies:
- NodeJS - Express.
- Unit test.
- Postgres database.
- JWT for authentication

### How to develop this project with Docker
Start project
```
docker-compose up
```

Running migration
```
docker exec -it job-board-api npm run migrate up
```

Create a new migration
```
docker exec -it job-board-api npm run migrate:create <your-migration-name>
```

Install a new library
```
docker exec -it job-board-api npm i <your-library>
```

Uninstall a library
```
docker exec -it job-board-api npm uninstall <your-library>
```
