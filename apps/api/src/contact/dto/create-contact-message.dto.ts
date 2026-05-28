import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class CreateContactMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @Transform(({ value }) => trimString(value))
  name!: string;

  @IsEmail()
  @MaxLength(180)
  @Transform(({ value }) => normalizeEmail(value))
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  @Transform(({ value }) => trimString(value))
  subject?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @Transform(({ value }) => trimString(value))
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(0)
  website?: string;
}
