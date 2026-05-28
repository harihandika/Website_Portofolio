import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthUser, JwtPayload, LoginResponse } from './interfaces/auth-user.interface';
import { PrismaService } from '../prisma/prisma.service';

type UserRecord = AuthUser & {
  password: string;
};

type UserDelegate = {
  findUnique(args: {
    where: { email?: string; id?: string };
    select: {
      id: true;
      name: true;
      email: true;
      password?: true;
      role: true;
      createdAt: true;
      updatedAt: true;
    };
  }): Promise<UserRecord | AuthUser | null>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser = this.toAuthUser(user);
    const payload: JwtPayload = {
      sub: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      user: safeUser,
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.userDelegate.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.toAuthUser(user);
  }

  private async findUserByEmail(email: string): Promise<UserRecord | null> {
    const user = await this.userDelegate.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !('password' in user)) {
      return null;
    }

    return user;
  }

  private get userDelegate(): UserDelegate {
    return (this.prisma as unknown as { user: UserDelegate }).user;
  }

  private toAuthUser(user: UserRecord | AuthUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
