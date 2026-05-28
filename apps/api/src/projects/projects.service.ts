import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponse, ProjectTechStackResponse } from './interfaces/project.interface';

type ProjectRecord = Omit<ProjectResponse, 'techStacks'> & {
  techStacks: Array<{
    techStack: ProjectTechStackResponse;
  }>;
};

type ProjectInclude = {
  techStacks: {
    include: {
      techStack: true;
    };
  };
};

type ProjectWriteData = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  techStacks?: {
    create?: Array<{ techStackId: string }>;
    deleteMany?: Record<string, never>;
  };
};

type ProjectDelegate = {
  findMany(args: {
    where?: { isFeatured?: boolean };
    include: ProjectInclude;
    orderBy: Array<{ displayOrder: 'asc' } | { createdAt: 'desc' }>;
  }): Promise<ProjectRecord[]>;
  findUnique(args: {
    where: { id?: string; slug?: string };
    include: ProjectInclude;
  }): Promise<ProjectRecord | null>;
  create(args: {
    data: ProjectWriteData;
    include: ProjectInclude;
  }): Promise<ProjectRecord>;
  update(args: {
    where: { id: string };
    data: ProjectWriteData;
    include: ProjectInclude;
  }): Promise<ProjectRecord>;
  delete(args: {
    where: { id: string };
  }): Promise<{ id: string }>;
};

const projectInclude: ProjectInclude = {
  techStacks: {
    include: {
      techStack: true,
    },
  },
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProjectResponse[]> {
    const projects = await this.projectDelegate.findMany({
      include: projectInclude,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return projects.map((project) => this.toProjectResponse(project));
  }

  async findFeatured(): Promise<ProjectResponse[]> {
    const projects = await this.projectDelegate.findMany({
      where: { isFeatured: true },
      include: projectInclude,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return projects.map((project) => this.toProjectResponse(project));
  }

  async findBySlug(slug: string): Promise<ProjectResponse> {
    const project = await this.projectDelegate.findUnique({
      where: { slug },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.toProjectResponse(project);
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectResponse> {
    const { techStackIds, ...projectData } = createProjectDto;

    try {
      const project = await this.projectDelegate.create({
        data: {
          ...this.removeUndefined(projectData),
          ...(techStackIds
            ? {
                techStacks: {
                  create: techStackIds.map((techStackId) => ({ techStackId })),
                },
              }
            : {}),
        },
        include: projectInclude,
      });

      return this.toProjectResponse(project);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponse> {
    const { techStackIds, ...projectData } = updateProjectDto;

    try {
      const project = await this.projectDelegate.update({
        where: { id },
        data: {
          ...this.removeUndefined(projectData),
          ...(techStackIds !== undefined
            ? {
                techStacks: {
                  deleteMany: {},
                  create: techStackIds.map((techStackId) => ({ techStackId })),
                },
              }
            : {}),
        },
        include: projectInclude,
      });

      return this.toProjectResponse(project);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.projectDelegate.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private get projectDelegate(): ProjectDelegate {
    return (this.prisma as unknown as { project: ProjectDelegate }).project;
  }

  private toProjectResponse(project: ProjectRecord): ProjectResponse {
    const techStacks = project.techStacks
      .map(({ techStack }) => techStack)
      .sort((left, right) => left.displayOrder - right.displayOrder || left.name.localeCompare(right.name));

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      problem: project.problem,
      solution: project.solution,
      impact: project.impact,
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      techStacks,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private removeUndefined<T extends Record<string, unknown>>(data: T): T {
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
  }

  private handlePrismaError(error: unknown): never {
    const code = this.getErrorCode(error);

    if (code === 'P2002') {
      throw new ConflictException('Project slug already exists');
    }

    if (code === 'P2003') {
      throw new BadRequestException('One or more tech stacks do not exist');
    }

    if (code === 'P2025') {
      throw new NotFoundException('Project not found');
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
