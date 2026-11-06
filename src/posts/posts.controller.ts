import {
  Body,
  Controller,
  Get,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { PostsService } from './posts.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Query } from '@nestjs/common/decorators/index.js';
import { DefaultValuePipe } from '@nestjs/common/pipes/default-value.pipe.js';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe.js';

class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  create(@Req() req: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.userId, dto);
  }

  @Get()
findAll(
  @Req() req: any,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return this.postsService.findAll(
    req.user.userId,
    page,
    limit,
  );
}
}