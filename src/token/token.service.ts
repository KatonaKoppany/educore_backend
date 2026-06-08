import { Role } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ==========================================
  // Genearet User Token
  // ==========================================
  async generateUserToken(userId: string, userRole: Role) {
    const payload = { sub: userId, role: userRole };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  // ==========================================
  // Store Refresh Token
  // ==========================================
  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.prismaService.refreshToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: token,
        expiryDate: expiryDate,
      },
      create: {
        userId: userId,
        token: token,
        expiryDate: expiryDate,
      },
    });
  }

  // ==========================================
  // Refresh Token
  // ==========================================
  async refreshTokens(refreshToken: string) {
    const token = await this.prismaService.refreshToken.findFirst({
      where: {
        token: refreshToken,
        expiryDate: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.generateUserToken(token.userId, token.user.role);
  }

  // ==========================================
  // Delete Refresh Token
  // ==========================================
  async deleteRefreshToken(token: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: { token: token },
    });
  }
}
