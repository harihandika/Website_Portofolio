import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(140)
  @Transform(({ value }) => trimString(value))
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  headline?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @Transform(({ value }) => trimString(value))
  bio?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Transform(({ value }) => trimString(value))
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  location?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimString(value))
  githubUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimString(value))
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimString(value))
  cvUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }) => trimString(value))
  photoUrl?: string;
}
