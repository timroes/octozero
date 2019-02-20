import React, { useContext, useState, useEffect } from 'react';

import { Notification } from '../../types';
import { GitHubContext } from '../../contexts/github';
import { NotificationItem } from './notification';

export function NotificationList() {
  const github = useContext(GitHubContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  const itemRefs: Array<React.RefObject<HTMLDivElement>> = [];
  for (let i = 0; i< notifications.length; i++) {
    itemRefs.push(React.createRef());
  }

  const loadNots = async () => {
    const notifications = await github.getUnreadNotifications();
    setNotifications(notifications);
  };

  const checkNotification = async (notification: Notification) => {
    await github.markNotificationAsRead(notification.id);
    await loadNots();
    focusChild(focused);
  };

  // TODO: How to handle loading and caching properly
  useEffect(() => {
    loadNots();
  }, [true]);

  const focusChild = (index: number) => {
    if (index >= 0 && index < itemRefs.length) {
      const toFocus = itemRefs[index].current;
      if (toFocus) {
        toFocus.focus();
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      focusChild(focused + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      focusChild(focused - 1);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {
         notifications.map((notification, index) => 
          <NotificationItem
            key={notification.id}
            ref={itemRefs[index]}
            notification={notification}
            initialOpen={false}
            onFocus={() => setFocused(index)}
            onCheck={() => checkNotification(notification)}
          />
        )
      }
      </div>
    );
}