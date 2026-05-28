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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponse } from './interfaces/project.interface';
import { ProjectsService } from './projects.service';

type AuthenticatedRequest = Request & {
  user: AuthUser;
};

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(): Promise<ProjectResponse[]> {
    return this.projectsService.findAll();
  }

  @Get('featured')
  findFeatured(): Promise<ProjectResponse[]> {
    return this.projectsService.findFeatured();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Promise<ProjectResponse> {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponse> {
    this.assertAdmin(request.user);
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    this.assertAdmin(request.user);
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    this.assertAdmin(request.user);
    await this.projectsService.delete(id);
  }

  private assertAdmin(user: AuthUser): void {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required');
    }
  }
}
