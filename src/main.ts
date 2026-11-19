import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcOptions } from './grpc.options';

async function bootstrap() {
  const options = grpcOptions();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, options);
  app.enableShutdownHooks();
  await app.listen();
  Logger.log(`gRPC server listening on ${options.options.url}`, 'Bootstrap');
}

bootstrap();
