export interface AuthResponse {
  accessToken: string;
  expiresIn: string;
}

export interface JwtPayload {
  username: string;
  sub: number;
  role: string;
}
