import {
  Controller,
  Get,
  Request,
  HttpCode,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { BlogsService } from '../application/blogs.service';
import { BlogInputQueryDto } from './dto/input/blog.input.dto';
import {
  sortNPagingBlogQuery,
  sortNPagingPostQuery,
} from '../../../infrastructure/utils/query.mappers';
import { PostInputQueryDto } from '../../posts/api/dto/input/post.input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { isUUID } from 'class-validator';
import { BearerAuthWithout401 } from '../../../infrastructure/decorators/bearer.auth.without.401';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async findBlogs(@Query() inputQuery: BlogInputQueryDto) {
    const query = sortNPagingBlogQuery(inputQuery);
    const blogs = await this.blogsQueryRepository.findBlogs(query);
    return blogs;
  }

  @Get(':blogId')
  @HttpCode(200)
  async findBlogById(@Param('blogId') blogId: string) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const foundBlog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!foundBlog) {
      throw new NotFoundException();
    }
    return foundBlog;
  }

  @UseGuards(BearerAuthWithout401)
  @Get(':blogId/posts')
  @HttpCode(200)
  async findPostsByBlogIdInParams(
    @Request() req,
    @Query() inputQuery: PostInputQueryDto,
    @Param('blogId') blogId: string,
  ) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
    if (!isBlogExist) {
      throw new NotFoundException();
    }
    const query = sortNPagingPostQuery(inputQuery);
    const foundPosts =
      await this.postsQueryRepository.findPostsByBlogIdInParams(
        query,
        blogId,
        req.userId,
      );
    if (!foundPosts) {
      throw new NotFoundException();
    }
    return foundPosts;
  }
}
