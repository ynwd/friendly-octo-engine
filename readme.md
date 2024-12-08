# Readme

## Prerequisites
- Node.js
- Mongo DB
- Docker

## Development Run

1. Rename `.env.example` file to `.env`.
2. How to run:
    - Development: 
        - `docker compose up` (run mongo db)
        - `npm run dev` (run appplication)
    - Build: compile TS files into JS files
        - `npm run build`
    - Production: run compiled codes.
        - `npm start`
3. Env (plase adjust according the needs)
    ```
    PORT=3000
    JWT_SECRET=jwt_secret
    MONGODB_URI=mongodb://mongo:27017/test
    MONGO_AUTH_SOURCE=admin
    MONGO_USER=root
    MONGO_PASSWORD=example
    ```

4. Dev Endpoint 
    - http://localhost:3000

## Docker Run

- Build image: `docker compose build`
- Run docker: `docker compose up`

## Prod Deployment

- Build: `gcloud builds submit --tag gcr.io/<project_id>/<app_name>`
- Deploy: `gcloud run deploy --image gcr.io/<project_id>/<app_name> --platform managed`
- End point: https://tinder-330182561382.us-central1.run.app/

## Unit Test
- Register & Login User: `npx jest src/services/userService.test.ts`
- Swipe: `npx jest src/services/swipeService.test.ts`
- Premium: `npx jest src/services/premiumService.test.ts`

## E2E Test
- Register & Login User: `npx jest src/test/register.e2e.test.ts`
- Swipe: `npx jest src/test/swipe.e2e.test.ts`
- Premium: `npx jest src/test/premium.e2e.test.ts`

## Quick Test
- You can run quick test with: `npm test`

## Lint
- `npm run lint`

## Format Code Base
- `npm run format`

## Structure

```text
.
├── Dockerfile
├── docker-compose.yml
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── .env
├── src
│   ├── app.ts
│   ├── config.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   ├── premiumController.ts
│   │   └── swipeController.ts
│   ├── database.ts
│   ├── index.ts
│   ├── middleware
│   │   └── currentUser.ts
│   ├── models
│   │   └── User.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   ├── premiumRoutes.ts
│   │   └── swipeRoutes.ts
│   ├── services
│   │   ├── premiumService.test.ts
│   │   ├── premiumService.ts
│   │   ├── swipeService.test.ts
│   │   ├── swipeService.ts
│   │   ├── userService.test.ts
│   │   └── userService.ts
│   ├── test
│   │   ├── premium.e2e.test.ts
│   │   ├── register.e2e.test.ts
│   │   └── swipe.e2e.test.ts
│   └── types
│       └── express.d.ts
└── tsconfig.json
```

|Item                | Description |
|--                  | --|
| Dockerfile         | Docker file |
| docker-compose.yml | Docker compose file to setup mongo db |
| eslint.config.mjs  | ESLint configuration file |
| jest.config.js     | Jest configuration file |
| package.json       | Dependencies file |
| .env               | Environment variable file |
| src                | Source code folder |
| src/index.ts       | application entry point |
| src/middleware     | middleware folder |
| src/routes         | routes folder |
| src/controller     | controller folder |
| src/service        | service folder |
| src/models         | database model folder |
| src/test           | E2E test folder |
