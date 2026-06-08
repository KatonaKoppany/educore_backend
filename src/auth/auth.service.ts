import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '@/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  // ==========================================
  // SignUp
  // ==========================================
  async signUp(signupData: SignupDto) {
    const emailInUse = await this.prismaService.user.findUnique({
      where: {
        email: signupData.email,
      },
    });

    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    await this.prismaService.user.create({
      data: {
        name: signupData.name,
        email: signupData.email,
        password: hashedPassword,
      },
    });
  }

  // ==========================================
  // Login
  // ==========================================
  async login(loginData: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginData.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const tokens = await this.tokenService.generateUserToken(
      user.id,
      user.role,
    );
    return {
      ...tokens,
      userId: user.id,
    };
  }
}
