import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponse } from './interfaces/experience.interface';

type ExperienceRecord = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type ExperienceWriteData = {
  company?: string;
  role?: string;
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string;
  achievements?: string[];
  displayOrder?: number;
};

type ExperienceDelegate = {
  findMany(args: {
    orderBy: Array<{ displayOrder: 'asc' } | { startDate: 'desc' }>;
  }): Promise<ExperienceRecord[]>;
  findUnique(args: { where: { id: string } }): Promise<ExperienceRecord | null>;
  create(args: { data: ExperienceWriteData }): Promise<ExperienceRecord>;
  update(args: { where: { id: string }; data: ExperienceWriteData }): Promise<ExperienceRecord>;
  delete(args: { where: { id: string } }): Promise<{ id: string }>;
};

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findTimeline(): Promise<ExperienceResponse[]> {
    const experiences = await this.experienceDelegate.findMany({
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    return experiences.map((experience) => this.toExperienceResponse(experience));
  }

  async create(createExperienceDto: CreateExperienceDto): Promise<ExperienceResponse> {
    const data = this.toExperienceWriteData(createExperienceDto);
    this.validateDateRange(data);

    try {
      const experience = await this.experienceDelegate.create({ data });
      return this.toExperienceResponse(experience);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<ExperienceResponse> {
    const existing = await this.experienceDelegate.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Experience not found');
    }

    const data = this.toExperienceWriteData(updateExperienceDto);
    this.validateDateRange({
      startDate: data.startDate ?? existing.startDate,
      endDate: data.endDate === undefined ? existing.endDate : data.endDate,
      isCurrent: data.isCurrent ?? existing.isCurrent,
    });

    try {
      const experience = await this.experienceDelegate.update({
        where: { id },
        data,
      });

      return this.toExperienceResponse(experience);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.experienceDelegate.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private get experienceDelegate(): ExperienceDelegate {
    return (this.prisma as unknown as { experience: ExperienceDelegate }).experience;
  }

  private toExperienceWriteData(dto: CreateExperienceDto | UpdateExperienceDto): ExperienceWriteData {
    return this.removeUndefined({
      company: dto.company,
      role: dto.role,
      location: dto.location,
      startDate: dto.startDate ? this.toDateOnly(dto.startDate) : undefined,
      endDate: dto.endDate === null ? null : dto.endDate ? this.toDateOnly(dto.endDate) : undefined,
      isCurrent: dto.isCurrent,
      description: dto.description,
      achievements: dto.achievements,
      displayOrder: dto.order,
    });
  }

  private toExperienceResponse(experience: ExperienceRecord): ExperienceResponse {
    return {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      isCurrent: experience.isCurrent,
      description: experience.description,
      achievements: experience.achievements,
      order: experience.displayOrder,
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
    };
  }

  private validateDateRange(data: Pick<ExperienceWriteData, 'startDate' | 'endDate' | 'isCurrent'>): void {
    if (data.isCurrent && data.endDate) {
      throw new BadRequestException('Current experience cannot have an end date');
    }

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      throw new BadRequestException('endDate cannot be earlier than startDate');
    }
  }

  private toDateOnly(value: string): Date {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  }

  private removeUndefined<T extends Record<string, unknown>>(data: T): T {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
  }

  private handlePrismaError(error: unknown): never {
    const code = this.getErrorCode(error);

    if (code === 'P2002') {
      throw new ConflictException('Experience already exists for this company, role, and start date');
    }

    if (code === 'P2025') {
      throw new NotFoundException('Experience not found');
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
