import { EuiEmptyPrompt, EuiLoadingSpinner } from '@elastic/eui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useGitHub, useSetting } from '../../services';
import { Notification as NotificationType } from '../../types';
import { NotificationItem } from './notification';

interface NotificationListProps {
  onNotificationsChange: (nots: NotificationType[]) => void;
}

export function NotificationList(props: NotificationListProps) {
  const github = useGitHub();
  const [isWebNotificationsActive] = useSetting('notifications_active');
  const [lastWebNotificationShown, setLastWebNotificationShown] = useState<moment.Moment>(moment());
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [focused, setFocused] = useState<number>(-1);
  const [isLoading, setLoading] = useState(true);

  const itemRefs: Array<React.RefObject<HTMLDivElement>> = [];
  // tslint:disable-next-line prefer-for-of
  for (let i = 0; i < notifications.length; i++) {
    itemRefs.push(React.createRef());
  }

  const loadNots = async () => {
    const nots = await github.getUnreadNotifications();
    // TODO: This should be extracted to a better place
    if (isWebNotificationsActive) {
      const newNotifications: NotificationType[] = [];
      for (const n of nots) {
        if (lastWebNotificationShown.isAfter(n.updated_at)) {
          // Since notifications are sorted by updated date, we're breaking this loop
          // as soon as we found the first "old" notifications
          break;
        }
        newNotifications.push(n);
      }
      if (newNotifications.length > 0) {
        // tslint:disable-next-line no-unused-expression -- web notification will be send via the constructor
        new Notification(`${newNotifications.length} GitHub changes`, {
          body: newNotifications.map(n => `* ${n.subject.title}`).join('\n'),
          icon: '/octozero.png',
        });
      }
      setLastWebNotificationShown(moment());
    }
    props.onNotificationsChange(nots);
    setNotifications(nots);
    setLoading(false);
  };

  const unsubscribeNotification = async (notification: NotificationType) => {
    await github.markNotificationAsRead(notification.id);
    await github.unsubscribeNotification(notification);
    await loadNots();
  };

  const checkNotification = async (notification: NotificationType) => {
    await github.markNotificationAsRead(notification.id);
    await loadNots();
  };

  useEffect(() => {
    loadNots();
    // TODO: somehow we need to "cancel" this request when navigating away
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Down': // IE/Edge Workaround
      case 'ArrowDown':
      case 'j':
        event.preventDefault();
        event.stopPropagation();
        focusChild(focused + 1);
        break;
      case 'Up': // IE/Edge workaround
      case 'ArrowUp':
      case 'k':
        event.preventDefault();
        event.stopPropagation();
        focusChild(focused - 1);
        break;
      case 'r':
        loadNots();
        break;
    }
  };

  const visibleNotifications = notifications.filter(notification =>
    ['Issue', 'PullRequest'].includes(notification.subject.type)
  );

  return (
    <div tabIndex={0} onKeyDown={onKeyDown}>
      {isLoading && <EuiLoadingSpinner size="xl" />}
      {!isLoading && visibleNotifications.length === 0 && (
        <EuiEmptyPrompt
          iconType="faceHappy"
          title={<h2>You have no unread notifications</h2>}
          body={<p>Enjoy your day!</p>}
        />
      )}
      {visibleNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          ref={itemRefs[index]}
          notification={notification}
          initialOpen={false}
          onFocus={() => setFocused(index)}
          onCheck={() => checkNotification(notification)}
          onMute={() => unsubscribeNotification(notification)}
        />
      ))}
    </div>
  );
}
