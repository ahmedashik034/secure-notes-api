import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersAggregationService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async groupUsersByInterests() {
    return this.userModel.aggregate([
      {
        $unwind: '$interests',
      },
      {
        $group: {
          _id: '$interests',
          totalUsers: { $sum: 1 },
          users: { $addToSet: '$name' },
        },
      },
      {
        $sort: { totalUsers: -1 },
      },
    ]);
  }
}