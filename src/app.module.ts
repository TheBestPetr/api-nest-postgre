import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { DeviceModule } from './features/securityDevices/device.module';
import { UserModule } from './features/users/user.module';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';

/*const postsProviders = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
  blogIdIsExist,
];

const commentsProvider = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository,
  CommentsLikeInfoRepository,
];*/

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sa',
      database: 'HwNest',
      autoLoadEntities: false,
      synchronize: false,
    }),
    AuthModule,
    DeviceModule,
    UserModule,
  ],

  providers: [],

  controllers: [DeleteAllController],
})
export class AppModule {}
