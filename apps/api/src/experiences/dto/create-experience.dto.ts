import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimNullableString(value: unknown) {
  if (value === null) {
    return null;
  }

  return trimString(value);
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map((item) => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
}

export class CreateExperienceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  @Transform(({ value }) => trimString(value))
  company!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  @Transform(({ value }) => trimString(value))
  role!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => trimNullableString(value))
  location?: string | null;

  @IsDateString({ strict: true })
  startDate!: string;

  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string | null;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  description!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(240, { each: true })
  @Transform(({ value }) => normalizeStringArray(value))
  achievements?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
