export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  token?: string;
  email: string;
  name: string;
  department: string;
  position: string;
  rank: string;
  roles: string[];
}

export interface User {
  email: string;
  name: string;
  department: string;
  position: string;
  rank: string;
  roles: string[];
}
