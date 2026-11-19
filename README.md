# NestJS gRPC Microservice

A production-style starting point for building gRPC microservices with NestJS. The service contract lives in a `.proto` file, errors map to proper gRPC status codes, and the template ships with unit tests, an end-to-end test over a real gRPC connection, and a multi-stage Docker image.

## What's inside

- **Proto-first contract** in [`proto/users.proto`](proto/users.proto): `CreateUser`, `GetUser`, `ListUsers`
- **NestJS microservice** using `@nestjs/microservices` with the gRPC transport
- **Real gRPC error codes**: `INVALID_ARGUMENT`, `ALREADY_EXISTS` and `NOT_FOUND`, not generic errors
- **Validation and pagination** with a capped page size
- **Tests**: unit tests for the service plus an e2e test that starts the server and calls it with a `@grpc/grpc-js` client
- **Docker**: multi-stage build that runs as a non-root user

## Project structure

```
proto/users.proto           gRPC contract
src/main.ts                 bootstraps the microservice
src/grpc.options.ts         transport, proto path and URL
src/users/                  controller, service, types, unit tests
test/users.e2e.spec.ts      end-to-end test over gRPC
scripts/client.ts           example client
```

## Getting started

```bash
npm install
npm run build
npm start                    # listens on 0.0.0.0:50051
```

In a second terminal, call it with the example client:

```bash
npm run client
```

Set `GRPC_URL` to change the bind address, e.g. `GRPC_URL=0.0.0.0:6000 npm start`.

## Tests

```bash
npm test
```

## Docker

```bash
docker build -t nestjs-grpc-microservice .
docker run -p 50051:50051 nestjs-grpc-microservice
```

## Extending it

1. Add RPCs and messages to `proto/users.proto`.
2. Mirror the message shapes in `src/users/users.types.ts`.
3. Add a `@GrpcMethod('UsersService', 'YourRpc')` handler in the controller.
4. Replace the in-memory `Map` in `UsersService` with your database layer (Prisma, TypeORM or Mongoose).

To add another service, create a new module with its own `.proto` file and add the package and proto path to `grpcOptions`.

## Author

Built by [Ravi Roshan](https://github.com/raviroshanmehta), Lead Backend Engineer. I've used this pattern for gRPC microservices in healthcare and AI automation products. [Get in touch on LinkedIn](https://www.linkedin.com/in/raviroshanmehta) if you need help with a microservices backend.
