import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

const url = process.env.GRPC_URL ?? '127.0.0.1:50051';
const definition = protoLoader.loadSync(join(__dirname, '..', 'proto', 'users.proto'), { keepCase: true, defaults: true });
const pkg = grpc.loadPackageDefinition(definition) as any;
const client = new pkg.users.UsersService(url, grpc.credentials.createInsecure());

client.CreateUser({ name: 'Jane', email: `jane+${Date.now()}@example.com` }, (err: grpc.ServiceError | null, user: unknown) => {
  if (err) {
    console.error(`${grpc.status[err.code]}: ${err.details}`);
    process.exit(1);
  }
  console.log('Created user:', user);
  client.ListUsers({ page: 1, page_size: 10 }, (listErr: grpc.ServiceError | null, res: unknown) => {
    if (listErr) throw listErr;
    console.log('All users:', res);
    client.close();
  });
});
