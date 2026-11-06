import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}