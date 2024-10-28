import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { PostsService } from '../posts/application/posts.service';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { SaBlogsController } from './api/sa.blogs.controller';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { BlogsController } from './api/blogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [SaBlogsController, BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
  ],
  exports: [BlogsQueryRepository],
})
export class BlogModule {}
