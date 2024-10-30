import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CommentOutputDto,
  CommentOutputQueryDto,
} from '../api/dto/output/comment.output.dto';
import { LikeStatus } from '../../../base/types/like.statuses';
import { CommentInputQueryDto } from '../api/dto/input/comment.input.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputDto | null> {
    const comment = await this.dataSource.query(
      `
        SELECT id, "postId", content, "createdAt"
            FROM public.comments
            WHERE "id" = $1`,
      [commentId],
    );
    if (comment.length === 0) {
      return null;
    }
    const commentatorInfo = await this.dataSource.query(`
        SELECT "userId", "userLogin"
            FROM public."commentsCommentatorInfo"
            WHERE "commentId" = '${comment[0].id}'`);
    const commentLikesCount = await this.dataSource.query(`
        SELECT "likesCount", "dislikesCount"
            FROM public."commentsLikesCountInfo"
            WHERE "commentId" = '${comment[0].id}'`);
    let status = 'None';
    if (userId) {
      const commentLikeStatus = await this.dataSource.query(`
        SELECT status
            FROM public."commentsUserLikeInfo"
            WHERE "commentId" = '${comment[0].id}' AND "userId" = '${userId}'`);
      status = commentLikeStatus[0].status;
    }
    if (comment.length > 0) {
      return {
        id: comment[0].id,
        content: comment[0].content,
        commentatorInfo: {
          userId: commentatorInfo[0].userId,
          userLogin: commentatorInfo[0].userLogin,
        },
        createdAt: comment[0].createdAt,
        likesInfo: {
          likesCount: commentLikesCount[0].likesCount,
          dislikesCount: commentLikesCount[0].dislikesCount,
          myStatus: status as LikeStatus,
        },
      };
    }
    return null;
  }

  async findCommentsForPost(
    postId: string,
    query: CommentInputQueryDto,
    userId?: string,
  ): Promise<CommentOutputQueryDto> {}
}
