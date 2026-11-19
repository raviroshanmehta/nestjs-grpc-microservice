export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface GetUserRequest {
  id: string;
}

export interface ListUsersRequest {
  page: number;
  page_size: number;
}

export interface ListUsersResponse {
  users: User[];
  total: number;
}
