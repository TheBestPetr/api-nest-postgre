import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
import { BlogsQueryRepository } from '../blogs/infrastructure/blogs.query.repository';
import { PostsController } from './api/posts.controller';
import { CommentsService } from '../comments/application/comments.service';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    CommentsService,
    UsersQueryRepository,
    CommentsRepository,
    JwtService,
  ],
  exports: [PostsService, PostsQueryRepository, PostsRepository],
})
export class PostModule {}
