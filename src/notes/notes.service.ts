import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Note, NoteDocument } from './schemas/note.schema.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  // Create a note for the authenticated user
  async create(userId: string, dto: CreateNoteDto) {
    return this.noteModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  // Get only the authenticated user's notes
  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      this.noteModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.noteModel.countDocuments({
        userId: new Types.ObjectId(userId),
      }),
    ]);

    return {
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get one note, only if it belongs to the user
  async findOne(id: string, userId: string) {
    const note = await this.noteModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  // Update only the user's own note
  async update(id: string, userId: string, dto: UpdateNoteDto) {
    const note = await this.noteModel.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(userId),
      },
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  // Delete only the user's own note
  async remove(id: string, userId: string) {
    const note = await this.noteModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return {
      message: 'Note deleted successfully',
    };
  }

  async findAllForAdmin(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    this.noteModel
      .find()
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    this.noteModel.countDocuments(),
  ]);

  return {
    data: notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}