import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module'; // Adjust the path as necessary

import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppNotification } from './core/entities/notification.entity';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', 
  }) , DatabaseModule, AdminModule, UserModule, ScheduleModule.forRoot(), TypeOrmModule.forFeature([AppNotification])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
