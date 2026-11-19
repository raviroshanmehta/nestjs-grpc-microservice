import { Injectable } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { CreateUserRequest, ListUsersRequest, ListUsersResponse, User } from './users.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAGE_SIZE = 100;

/**
 * In-memory store so the template runs with zero setup.
 * Swap the Map for a repository (Prisma, TypeORM, Mongoose) in a real service.
 */
@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  create(input: CreateUserRequest): User {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();

    if (!name) {
      throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'name is required' });
    }
    if (!email || !EMAIL_PATTERN.test(email)) {
      throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'a valid email is required' });
    }
    if ([...this.users.values()].some((u) => u.email === email)) {
      throw new RpcException({ code: status.ALREADY_EXISTS, message: `user with email ${email} already exists` });
    }

    const user: User = { id: randomUUID(), name, email, created_at: new Date().toISOString() };
    this.users.set(user.id, user);
    return user;
  }

  findOne(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new RpcException({ code: status.NOT_FOUND, message: `user ${id} not found` });
    }
    return user;
  }

  list({ page, page_size }: ListUsersRequest): ListUsersResponse {
    const size = Math.min(Math.max(page_size || 20, 1), MAX_PAGE_SIZE);
    const current = Math.max(page || 1, 1);
    const all = [...this.users.values()];
    const start = (current - 1) * size;
    return { users: all.slice(start, start + size), total: all.length };
  }
}
