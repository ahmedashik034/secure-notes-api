import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument, UserRole } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();

    if (await this.userModel.exists({ email })) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.userModel.create({
      ...dto,
      email,
      password: await bcrypt.hash(dto.password, 12),
      role: dto.role ?? UserRole.USER,
    });

    return this.toSafeUser(user);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const updates: Record<string, any> = { ...dto };

    if (dto.email) {
      updates.email = dto.email.toLowerCase();

      const existing = await this.userModel.findOne({
        email: updates.email,
        _id: { $ne: id },
      });

      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }

    if (dto.password) {
      updates.password = await bcrypt.hash(dto.password, 12);
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  private toSafeUser(user: any) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests,
      createdAt: user.createdAt,
    };
  }
}