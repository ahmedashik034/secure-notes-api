import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';

import { UserRole } from '../schemas/user.schema.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}