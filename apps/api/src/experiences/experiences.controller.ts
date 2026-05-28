import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponse } from './interfaces/experience.interface';
import { ExperiencesService } from './experiences.service';

type AuthenticatedRequest = Request & {
  user: AuthUser;
};

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findTimeline(): Promise<ExperienceResponse[]> {
    return this.experiencesService.findTimeline();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceResponse> {
    this.assertAdmin(request.user);
    return this.experiencesService.create(createExperienceDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceResponse> {
    this.assertAdmin(request.user);
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.assertAdmin(request.user);
    await this.experiencesService.delete(id);
  }

  private assertAdmin(user: AuthUser): void {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required');
    }
  }
}
