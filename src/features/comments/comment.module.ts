import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, CommentatorInfo, LikesInfo } from './domain/comment.entity';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentatorInfo, LikesInfo])],
  controllers: [],
  providers: [CommentsService, CommentsRepository, UsersQueryRepository],
  exports: [CommentsService, CommentsRepository],
})
export class CommentModule {}
