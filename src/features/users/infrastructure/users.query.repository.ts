import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthIOutputDto } from '../../auth/api/dto/output/auth.output.dto';
import { UserInputQueryDto } from '../api/dto/input/user.input.dto';
import { UserOutputQueryDto } from '../api/dto/output/user.output.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async findUsers(query: UserInputQueryDto) /*: Promise<UserOutputQueryDto>*/ {}

  async findUserById(userId: string): Promise<AuthIOutputDto> {
    const user = await this.dataSource.query(
      `SELECT *
        FROM public.users
        WHERE "id" = '${userId}';`,
    );
    return {
      email: user[0].email,
      login: user[0].login,
      userId: user[0].id,
    };
  }
}
