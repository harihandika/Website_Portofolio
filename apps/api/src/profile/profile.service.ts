import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponse } from './interfaces/profile.interface';

type ProfileDelegate = {
  findFirst(args: {
    orderBy: { createdAt: 'asc' | 'desc' };
    select: ProfileSelect;
  }): Promise<ProfileResponse | null>;
  update(args: {
    where: { id: string };
    data: UpdateProfileDto;
    select: ProfileSelect;
  }): Promise<ProfileResponse>;
};

type ProfileSelect = {
  id: true;
  fullName: true;
  headline: true;
  bio: true;
  email: true;
  phone: true;
  location: true;
  githubUrl: true;
  linkedinUrl: true;
  cvUrl: true;
  photoUrl: true;
  createdAt: true;
  updatedAt: true;
};

const profileSelect: ProfileSelect = {
  id: true,
  fullName: true,
  headline: true,
  bio: true,
  email: true,
  phone: true,
  location: true,
  githubUrl: true,
  linkedinUrl: true,
  cvUrl: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicProfile(): Promise<ProfileResponse> {
    const profile = await this.profileDelegate.findFirst({
      orderBy: { createdAt: 'asc' },
      select: profileSelect,
    });

    if (!profile) {
      throw new NotFoundException('Profile has not been created yet');
    }

    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<ProfileResponse> {
    const profile = await this.findPublicProfile();

    return this.profileDelegate.update({
      where: { id: profile.id },
      data: updateProfileDto,
      select: profileSelect,
    });
  }

  private get profileDelegate(): ProfileDelegate {
    return (this.prisma as unknown as { profile: ProfileDelegate }).profile;
  }
}
