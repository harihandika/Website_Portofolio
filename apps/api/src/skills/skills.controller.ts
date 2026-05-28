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
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillCategoryResponse, SkillResponse } from './interfaces/skill.interface';
import { SkillsService } from './skills.service';

type AuthenticatedRequest = Request & {
  user: AuthUser;
};

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll(): Promise<SkillCategoryResponse[]> {
    return this.skillsService.findAllGrouped();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: AuthenticatedRequest, @Body() createSkillDto: CreateSkillDto): Promise<SkillResponse> {
    this.assertAdmin(request.user);
    return this.skillsService.create(createSkillDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponse> {
    this.assertAdmin(request.user);
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.assertAdmin(request.user);
    await this.skillsService.delete(id);
  }

  private assertAdmin(user: AuthUser): void {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required');
    }
  }
}
