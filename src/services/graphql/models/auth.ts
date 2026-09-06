import type { RawCartItem } from './cart';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

type UserWithCart = User & { cart: RawCartItem[] };

export interface LoginResponse {
  login: {
    token: string;
    user: UserWithCart;
  };
}

export interface RegisterResponse {
  register: {
    token: string;
    user: UserWithCart;
  };
}

export interface MeResponse {
  me: UserWithCart;
}

export interface RefreshTokenResponse {
  refreshToken: {
    token: string;
    user: UserWithCart;
  };
}

export interface LogoutResponse {
  logout: boolean;
}
