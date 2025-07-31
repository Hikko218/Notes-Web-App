// NestJS JWT strategy for extracting token from cookies
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';

// JWT payload interface
interface JwtPayload {
  sub: number;
  username: string;
}

// Express request with cookies
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT token from cookie named 'token'
      jwtFromRequest: (req: Request) =>
        (req as RequestWithCookies).cookies?.token,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Validate and attach user info to request
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
