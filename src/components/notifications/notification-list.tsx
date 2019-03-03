import { EuiLoadingSpinner } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useGitHub } from '../../services/github';
import { Notification } from '../../types';
import { NotificationItem } from './notification';

export function NotificationList() {
  const github = useGitHub();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [focused, setFocused] = useState<number>(-1);
  const [isLoading, setLoading] = useState(true);

  const itemRefs: Array<React.RefObject<HTMLDivElement>> = [];
  // tslint:disable-next-line prefer-for-of
  for (let i = 0; i < notifications.length; i++) {
    itemRefs.push(React.createRef());
  }

  const loadNots = async () => {
    setNotifications(await github.getUnreadNotifications());
    setLoading(false);
  };

  const checkNotification = async (notification: Notification) => {
    await github.markNotificationAsRead(notification.id);
    await loadNots();
  };

  useEffect(() => {
    loadNots();
    // TODO: somehow we need to "cancel" this request when navigating away
  }, []);

  useEffect(() => {
    focusChild(focused);
  });

  useEffect(() => {
    const intervalId = setInterval(loadNots, 60000);
    return () => {
      clearInterval(intervalId);
    };
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
    <div tabIndex={0} onKeyDown={onKeyDown}>
      {isLoading && <EuiLoadingSpinner size="xl" />}
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          ref={itemRefs[index]}
          notification={notification}
          initialOpen={false}
          onFocus={() => setFocused(index)}
          onCheck={() => checkNotification(notification)}
        />
      ))}
    </div>
  );
}
