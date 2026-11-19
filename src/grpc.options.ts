import { join } from 'path';
import { GrpcOptions, Transport } from '@nestjs/microservices';

export const PROTO_PATH = join(__dirname, '..', 'proto', 'users.proto');

export function grpcOptions(url = process.env.GRPC_URL ?? '0.0.0.0:50051'): GrpcOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: PROTO_PATH,
      url,
      loader: { keepCase: true, longs: String, defaults: true },
    },
  };
}
