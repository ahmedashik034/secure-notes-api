import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../users/schemas/user.schema.js';

@ApiTags('Notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notesService.findAll(req.user.userId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() req: any) {
    return this.notesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() req: any,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @Req() req: any) {
    return this.notesService.remove(id, req.user.userId);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notesService.findAllForAdmin(page, limit);
  }
}
