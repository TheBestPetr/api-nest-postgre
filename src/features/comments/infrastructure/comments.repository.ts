import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comment, CommentatorInfo, LikesInfo } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(
    inputComment: Comment,
    inputCommentatorInfo: CommentatorInfo,
    inputCommentLikesInfo: LikesInfo,
  ) {
    const insertedComment = await this.dataSource.query(
      `INSERT INTO public.comments(
            "postId", content)
            VALUES ($1, $2)
            RETURNING *`,
      [inputComment.postId, inputComment.content],
    );
    console.log(insertedComment[0].id);

    await this.dataSource.query(
      `INSERT INTO public."commentsCommentatorInfo"(
            "commentId", "userId", "userLogin")
            VALUES ('${insertedComment[0].id}', $1, $2);`,
      [inputCommentatorInfo.userId, inputCommentatorInfo.userLogin],
    );

    await this.dataSource.query(
      `INSERT INTO public."commentsLikesCountInfo"(
            "commentId", "likesCount", "dislikesCount")
            VALUES ('${insertedComment[0].id}', $1, $2);`,
      [inputCommentLikesInfo.likesCount, inputCommentLikesInfo.dislikesCount],
    );
    return insertedComment[0];
  }
}
