import { Injectable } from '@nestjs/common';
import { PostInputQueryDto } from '../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../api/dto/output/post.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
    //userId?: string,
  ): Promise<PostOutputQueryDto> {
    const items = await this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
      FROM public.posts
      WHERE "blogId" = $1
      ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
      LIMIT $2 OFFSET $3`,
      [blogId, query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.posts
        WHERE "blogId" = $1`,
      [blogId],
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount as number,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async findPosts(query: PostInputQueryDto): Promise<PostOutputQueryDto> {
    const items = await this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
      FROM public.posts
      ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
      LIMIT $1 OFFSET $2`,
      [query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.posts`,
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount as number,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async findPostById(postId: string): Promise<PostOutputDto | null> {
    const post = await this.dataSource.query(`
        SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
        FROM public.posts
        WHERE "id" = '${postId}';`);
    if (post.length > 0) {
      return {
        id: post[0].id,
        title: post[0].title,
        shortDescription: post[0].shortDescription,
        content: post[0].content,
        blogId: post[0].blogId,
        blogName: post[0].blogName,
        createdAt: post[0].createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    }
    return null;
  }
}
