import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from '../domain/post.entity';
import { PostInputDto } from '../api/dto/input/post.input.dto';
import { LikeStatus } from '../../../base/types/like.statuses';
import { PostLikeEntity } from '../domain/post.like.entity';

@Injectable()
export class PostsLikeInfoRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findPostsLikesInfo(postId: string, userId: string) {
    return this.dataSource.query(
      `SELECT "postId", "userId", "userLogin", status, "createdAt"
        FROM public."postsUserLikeInfo"
        WHERE "postId" = $1 AND "userId" = $2`,
      [postId, userId],
    );
  }

  async createNewLikeInfo(postLikeInfo: PostLikeEntity): Promise<boolean> {
    return this.dataSource.query(
      `INSERT INTO public."postsUserLikeInfo"(
            "postId", "userId", "userLogin", status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [
        postLikeInfo.postId,
        postLikeInfo.userId,
        postLikeInfo.userLogin,
        postLikeInfo.status,
      ],
    );
  }

  /*async findNewestLikes(postId: string): Promise<PostLikeEntity[] | null> {
    const newestLikes = await this.PostLikeInfoModel.find({
      postId: postId,
      status: 'Like',
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
    return newestLikes.length > 0 ? newestLikes : null;
  }*/

  async updateAddPostLikesCount(
    postId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    if (likeStatus === 'Like') {
      await this.dataSource.query(
        `INSERT INTO public."postsLikesCountInfo"(
            "postId", "likesCount")
            VALUES ($1, $2);`,
        [postId, +1],
      );
      return true;
    }
    if (likeStatus === 'Dislike') {
      await this.dataSource.query(
        `INSERT INTO public."postsLikesCountInfo"(
            "postId", "dislikesCount")
            VALUES ($1, $2);`,
        [postId, +1],
      );
      return true;
    }
    return false;
  }

  async updatePostLikeInfo(
    postId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."commentsUserLikeInfo"
            SET status = $1
            WHERE "postId" = $2 AND "userId" = $3;`,
      [newStatus, postId, userId],
    );
    return result;
  }

  async updateExistPostLikesCount(
    postId: string,
    oldStatus: LikeStatus,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    if (oldStatus === 'Like' && newStatus === 'Dislike') {
      await this.dataSource.query(`
        UPDATE public."commentsLikesCountInfo"
            SET "likesCount"=?, "dislikesCount"=?
            WHERE "commentId" = $3;`);

      /*updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { 'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1 } },
      ).exec();*/
      return true;
    }
    if (oldStatus === 'Like' && newStatus === 'None') {
      await this.PostModel.updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { 'likesInfo.likesCount': -1 } },
      ).exec();
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'Like') {
      await this.PostModel.updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { 'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1 } },
      ).exec();
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'None') {
      await this.PostModel.updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { 'likesInfo.dislikesCount': -1 } },
      ).exec();
      return true;
    }
    return oldStatus === newStatus;
  }
}
