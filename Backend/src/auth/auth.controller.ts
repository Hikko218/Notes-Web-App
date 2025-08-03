import {
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

interface LoginBody {
  email: string;
  password: string;
}

interface User {
  userId: number;
  username: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {}

  // Login route: expects username and password in body
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBody, @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }
    await this.authService.login(user, res);
  }

  // Protected admin route
  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  getUserStatus(@Res() res: Response) {
    const req = res.req as unknown as AuthenticatedRequest;
    const user = req.user;
    return res.send({
      isAuthenticated: !!user,
      userId: user?.userId ?? null,
      username: user?.username ?? null,
    });
  }

  // Logout route
  @Post('logout')
  @HttpCode(200)
  logout(@Res() res: Response) {
    res.clearCookie('token', { path: '/' });
    return res.send({ message: 'Logged out' });
  }
}
