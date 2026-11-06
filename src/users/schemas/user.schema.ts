import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  interests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Unique index: prevents duplicate email addresses.
UserSchema.index({ email: 1 }, { unique: true });

// Supports admin user-list pagination.
UserSchema.index({ createdAt: -1, _id: -1 });