import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DeviceModule } from './features/securityDevices/device.module';
import { UserModule } from './features/users/user.module';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';
import {
  emailConfirmationCodeIsExist,
  emailIsExist,
  emailResendingIsEmailConfirmed,
  loginIsExist,
  passwordRecoveryCodeIsExist,
} from './infrastructure/decorators/auth.custom.decorator';
import { ReqIpCounter } from './infrastructure/guards/req-counter/req.ip.counter';
import { BlogModule } from './features/blogs/blog.module';
import { PostModule } from './features/posts/post.module';
import { CommentModule } from './features/comments/comment.module';
import { HelloPageModule } from './base/1page/hello.page';
import { SETTINGS } from './settings/app.settings';

@Module({
  imports: [
    SETTINGS.CONNECT_TO_NEON_DB,
    AuthModule,
    DeviceModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentModule,
    HelloPageModule,
  ],

  providers: [
    loginIsExist,
    emailIsExist,
    passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,
    ReqIpCounter,
  ],

  controllers: [DeleteAllController],
})
export class AppModule {}
