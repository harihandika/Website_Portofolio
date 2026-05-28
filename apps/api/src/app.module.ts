import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { validateEnv } from './config/env.validation';
import { ExperiencesModule } from './experiences/experiences.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ProfileModule,
    ProjectsModule,
    SkillsModule,
    ExperiencesModule,
    ContactModule,
  ],
})
export class AppModule {}
