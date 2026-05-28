import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { SkillLevelValue } from '../interfaces/skill.interface';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => trimString(value))
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => trimString(value))
  category?: string;

  @IsOptional()
  @IsEnum(SkillLevelValue)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  level?: SkillLevelValue;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
