# NESTJS WITH SSE (SERVER SENT EVENTS)

## Description
Test project created to check some features on NestJS

## Technologies
- NodeJS
- NestJS
- TypeScript
- Redis (To test with queue)
- BullMQ (To use integration with Redis)
- MySQL (To store events)

## How to Execute
- Setup: `npm install`
- Execute Docker: `docker compose --profile dev up -d`

- Run dev `npm run start:dev`
* Remember to check the folder for MySQL data in `docker-compose.yaml` file (Otherwise it will create at project root folder)
* Remember to run the prisma migrations