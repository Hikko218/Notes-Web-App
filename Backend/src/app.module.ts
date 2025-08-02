import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    NotesModule,
    UsersModule,
    AuthModule,
    FolderModule,
  ],
})
export class AppModule {}
