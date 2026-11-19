import 'reflect-metadata';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { INestMicroservice } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { grpcOptions, PROTO_PATH } from '../src/grpc.options';

const URL = '127.0.0.1:50999';

type Callback<T> = (err: grpc.ServiceError | null, res: T) => void;
type Client = grpc.Client & Record<string, (req: object, cb: Callback<any>) => void>;

function call<T>(client: Client, method: string, req: object): Promise<T> {
  return new Promise((resolve, reject) => client[method](req, (err, res) => (err ? reject(err) : resolve(res))));
}

describe('UsersService over gRPC (e2e)', () => {
  let app: INestMicroservice;
  let client: Client;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestMicroservice(grpcOptions(URL));
    await app.listen();

    const definition = protoLoader.loadSync(PROTO_PATH, { keepCase: true, defaults: true });
    const pkg = grpc.loadPackageDefinition(definition) as any;
    client = new pkg.users.UsersService(URL, grpc.credentials.createInsecure());
  });

  afterAll(async () => {
    client.close();
    await app.close();
  });

  it('creates, gets and lists users', async () => {
    const created = await call<any>(client, 'CreateUser', { name: 'Ravi', email: 'ravi@example.com' });
    expect(created.id).toBeTruthy();

    const fetched = await call<any>(client, 'GetUser', { id: created.id });
    expect(fetched.email).toBe('ravi@example.com');

    const list = await call<any>(client, 'ListUsers', { page: 1, page_size: 10 });
    expect(list.total).toBe(1);
  });

  it('maps errors to gRPC status codes', async () => {
    await expect(call(client, 'GetUser', { id: 'missing' })).rejects.toMatchObject({ code: grpc.status.NOT_FOUND });
    await expect(call(client, 'CreateUser', { name: 'X', email: 'bad' })).rejects.toMatchObject({
      code: grpc.status.INVALID_ARGUMENT,
    });
  });
});
