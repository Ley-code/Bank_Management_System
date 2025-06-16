import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppNotification, NotificationType } from './core/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(AppNotification) 
    private readonly appNotificationRepository: Repository<AppNotification>,
  ) {}
  async getAllNotifications(){
    const notifications = await this.appNotificationRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['customer'],
    });
    return {
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: notifications.map(notification => ({
        id: notification.id,
        customerId: notification.customer.id,
        relatedLoanId: notification.relatedLoanId,
        relatedAccountId: notification.relatedAccountId,
        relatedTransactionId: notification.relatedTransactionId,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
      })),
    
    };
  }
  async deleteAllNotifications() {
    const result = await this.appNotificationRepository.delete({
      isRead: false,
    });
    if (result.affected === 0) {
      return {
        status: 'error',
        message: 'No notifications to delete',
      };
    }
    return {
      status: 'success',
      message: 'All notifications deleted successfully',
    };
  }
}
