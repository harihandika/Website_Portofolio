import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
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

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  @Transform(({ value }) => trimString(value))
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must use lowercase letters, numbers, and hyphens only',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  slug!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(280)
  @Transform(({ value }) => trimString(value))
  summary!: string;

  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  description!: string;

  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  problem!: string;

  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  solution!: string;

  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  impact!: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimNullableString(value))
  imageUrl?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimNullableString(value))
  demoUrl?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimNullableString(value))
  githubUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  techStackIds?: string[];
}
