import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getAllNotifications();
  }

  @Delete('/delete')
  deleteNotification() {
    return this.appService.deleteAllNotifications();
  }
}
