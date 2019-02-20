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

  useEffect(() => {
    const intervalId = setInterval(loadNots, 60000);
    return () => { clearInterval(intervalId); }
  });

  const focusChild = (index: number) => {
    if (index >= 0 && index < itemRefs.length) {
      const toFocus = itemRefs[index].current;
      if (toFocus) {
        toFocus.focus();
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Down': // IE/Edge Workaround
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        focusChild(focused + 1);
        break;
      case 'Up': // IE/Edge workaround
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        focusChild(focused - 1);
        break;
      case 'r':
        loadNots();
        break;
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