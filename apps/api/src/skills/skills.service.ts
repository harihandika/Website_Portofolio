import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillCategoryResponse, SkillLevelValue, SkillResponse } from './interfaces/skill.interface';

type SkillRecord = {
  id: string;
  name: string;
  category: string;
  level: SkillLevelValue;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type SkillWriteData = {
  name?: string;
  category?: string;
  level?: SkillLevelValue;
  displayOrder?: number;
};

type SkillDelegate = {
  findMany(args: {
    orderBy: Array<{ category: 'asc' } | { displayOrder: 'asc' } | { name: 'asc' }>;
  }): Promise<SkillRecord[]>;
  create(args: { data: SkillWriteData }): Promise<SkillRecord>;
  update(args: { where: { id: string }; data: SkillWriteData }): Promise<SkillRecord>;
  delete(args: { where: { id: string } }): Promise<{ id: string }>;
};

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllGrouped(): Promise<SkillCategoryResponse[]> {
    const skills = await this.skillDelegate.findMany({
      orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
    });

    const grouped = new Map<string, SkillResponse[]>();

    for (const skill of skills) {
      const response = this.toSkillResponse(skill);
      const categorySkills = grouped.get(response.category) ?? [];
      categorySkills.push(response);
      grouped.set(response.category, categorySkills);
    }

    return Array.from(grouped.entries()).map(([category, categorySkills]) => ({
      category,
      skills: categorySkills,
    }));
  }

  async create(createSkillDto: CreateSkillDto): Promise<SkillResponse> {
    try {
      const skill = await this.skillDelegate.create({
        data: this.toSkillWriteData(createSkillDto),
      });

      return this.toSkillResponse(skill);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<SkillResponse> {
    try {
      const skill = await this.skillDelegate.update({
        where: { id },
        data: this.toSkillWriteData(updateSkillDto),
      });

      return this.toSkillResponse(skill);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.skillDelegate.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private get skillDelegate(): SkillDelegate {
    return (this.prisma as unknown as { skill: SkillDelegate }).skill;
  }

  private toSkillWriteData(dto: CreateSkillDto | UpdateSkillDto): SkillWriteData {
    return this.removeUndefined({
      name: dto.name,
      category: dto.category,
      level: dto.level,
      displayOrder: dto.order,
    });
  }

  private toSkillResponse(skill: SkillRecord): SkillResponse {
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order: skill.displayOrder,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }

  private removeUndefined<T extends Record<string, unknown>>(data: T): T {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
  }

  private handlePrismaError(error: unknown): never {
    const code = this.getErrorCode(error);

    if (code === 'P2002') {
      throw new ConflictException('Skill already exists in this category');
    }

    if (code === 'P2025') {
      throw new NotFoundException('Skill not found');
    }

    throw error;
  }

  private getErrorCode(error: unknown): string | undefined {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
      return undefined;
    }

    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
}
