import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true, versionKey: false })
export class Note {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title!: string;

  @Prop({
    required: true,
    trim: true,
  })
  content!: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Index for retrieving a user's notes with pagination
NoteSchema.index({ userId: 1, createdAt: -1, _id: -1 });

// Index for admin pagination across all notes
NoteSchema.index({ createdAt: -1, _id: -1 });