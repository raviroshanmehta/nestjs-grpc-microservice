import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserRequest, GetUserRequest, ListUsersRequest, ListUsersResponse, User } from './users.types';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @GrpcMethod('UsersService', 'CreateUser')
  createUser(request: CreateUserRequest): User {
    return this.users.create(request);
  }

  @GrpcMethod('UsersService', 'GetUser')
  getUser(request: GetUserRequest): User {
    return this.users.findOne(request.id);
  }

  @GrpcMethod('UsersService', 'ListUsers')
  listUsers(request: ListUsersRequest): ListUsersResponse {
    return this.users.list(request);
  }
}
