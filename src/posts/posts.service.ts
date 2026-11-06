import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Post, PostDocument } from './schemas/post.schema.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(userId: string, dto: { title: string; content: string }) {
    return this.postModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

 async findAll(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    this.postModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    this.postModel.countDocuments({
      userId: new Types.ObjectId(userId),
    }),
  ]);

  return {
    data: posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}