import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';

function codeOf(fn: () => unknown): number | undefined {
  try {
    fn();
  } catch (e) {
    return ((e as RpcException).getError() as { code: number }).code;
  }
  return undefined;
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('creates and fetches a user', () => {
    const created = service.create({ name: 'Ada', email: 'Ada@Example.com' });
    expect(created.email).toBe('ada@example.com');
    expect(service.findOne(created.id)).toEqual(created);
  });

  it('rejects invalid input', () => {
    expect(codeOf(() => service.create({ name: '', email: 'a@b.co' }))).toBe(status.INVALID_ARGUMENT);
    expect(codeOf(() => service.create({ name: 'Ada', email: 'nope' }))).toBe(status.INVALID_ARGUMENT);
  });

  it('rejects duplicate emails', () => {
    service.create({ name: 'Ada', email: 'ada@example.com' });
    expect(codeOf(() => service.create({ name: 'Ada 2', email: 'ADA@example.com' }))).toBe(status.ALREADY_EXISTS);
  });

  it('returns NOT_FOUND for unknown ids', () => {
    expect(codeOf(() => service.findOne('missing'))).toBe(status.NOT_FOUND);
  });

  it('paginates and caps page size', () => {
    for (let i = 0; i < 5; i++) service.create({ name: `U${i}`, email: `u${i}@example.com` });
    const page2 = service.list({ page: 2, page_size: 2 });
    expect(page2.users.map((u) => u.name)).toEqual(['U2', 'U3']);
    expect(page2.total).toBe(5);
    expect(service.list({ page: 1, page_size: 1000 }).users).toHaveLength(5);
  });
});
