import { AuthGuard } from '@/guard/auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // ==========================================
  // Me
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = req.user.userId;
    return this.userService.me(userId);
  }
}
