import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UsersAggregationService } from './users-aggregation.service.js';
import { PostsAggregationService } from '../posts/posts-aggregation.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    RolesGuard,
    UsersAggregationService,
    PostsAggregationService,
  ],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
