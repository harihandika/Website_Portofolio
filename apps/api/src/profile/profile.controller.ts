import { Body, Controller, ForbiddenException, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponse } from './interfaces/profile.interface';
import { ProfileService } from './profile.service';

type AuthenticatedRequest = Request & {
  user: AuthUser;
};

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(): Promise<ProfileResponse> {
    return this.profileService.findPublicProfile();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required');
    }

    return this.profileService.updateProfile(updateProfileDto);
  }
}
