package com.studenthub.service;

import com.studenthub.dto.NotificationDto;
import com.studenthub.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getUserNotifications(Long userId);
    Long getUnreadCount(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId);
    NotificationDto sendNotification(Long userId, String title, String message, NotificationType type);
}
