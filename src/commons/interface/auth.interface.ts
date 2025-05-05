import { ApiProperty } from '@nestjs/swagger';

export interface AuthResponse {
  accessToken: string;
  expiresIn: string;
}

export class AuthDocResponse {
  @ApiProperty({ description: 'The JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'The expiration time of the token' })
  expiresIn: string;
}

export interface JwtPayload {
  username: string;
  sub: number;
  role: string;
}

export const PaginationHeaders = {
  'X-Current-Page': {
    description: 'The current page number',
    schema: { type: 'integer', example: 1 },
  },
  'X-Page-Size': {
    description: 'The number of items per page',
    schema: { type: 'integer', example: 10 },
  },
  'X-Total-Pages': {
    description: 'The total number of pages',
    schema: { type: 'integer', example: 5 },
  },
};
