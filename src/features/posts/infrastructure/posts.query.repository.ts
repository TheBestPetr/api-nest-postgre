import { Injectable } from '@nestjs/common';
import { PostInputQueryDto } from '../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../api/dto/output/post.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../../base/types/like.statuses';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
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

  async findPosts(
    query: PostInputQueryDto,
    userId?: string,
  ): Promise<PostOutputQueryDto> {
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

  async findPostById(
    postId: string,
    userId?: string,
  ): Promise<PostOutputDto | null> {
    const post = await this.dataSource.query(`
        SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
        FROM public.posts
        WHERE "id" = '${postId}';`);
    const postLikesCount = await this.dataSource.query(`
        SELECT "likesCount", "dislikesCount"
            FROM public."postsLikesCountInfo"
            WHERE "postId" = '${post[0].id}'`);
    let status = 'None';
    if (userId) {
      const postLikeStatus = await this.dataSource.query(`
        SELECT status
            FROM public."postsUserLikeInfo"
            WHERE "postId" = '${post[0].id}' AND "userId" = '${userId}'`);
      status = postLikeStatus[0].status;
    }
    const newestLikes = await this.dataSource.query(`
        SELECT "postId", "userId", "userLogin", status, "createdAt"
            FROM public."postsUserLikeInfo"
            WHERE "postId" = '${post[0].id}' AND "status" = 'Like'
            ORDER BY "createdAt" DESC
            LIMIT 3`);
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
          likesCount: postLikesCount[0].likesCount,
          dislikesCount: postLikesCount[0].dislikesCount,
          myStatus: status as LikeStatus,
          newestLikes: newestLikes.map((like) => ({
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.userLogin,
          })),
        },
      };
    }
    return null;
  }
}
