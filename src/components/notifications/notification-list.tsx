import { EuiEmptyPrompt, EuiPortal, EuiProgress } from '@elastic/eui';
import Octokit from '@octokit/rest';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useGitHub, useSetting } from '../../services';
import { Notification as NotificationType } from '../../types';
import { NotificationItem } from './notification';
import { useCounter } from '../../utils/hooks';

interface NotificationListProps {
  repos?: Octokit.ActivityListNotificationsForRepoParams[],
  onNotificationsChange: (nots: NotificationType[]) => void;
}

// TODO: This component has become a huge mess and needs to be cleaned up properly
export function NotificationList(props: NotificationListProps) {
  const github = useGitHub();
  const [isWebNotificationsActive] = useSetting('notifications_active');
  const [lastWebNotificationShown, setLastWebNotificationShown] = useState<moment.Moment>(moment());
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [focused, setFocused] = useState<number>(-1);
  const [loadingCounter, increaseLoadingCounter, decreaseLoadingCounter] = useCounter(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [hasLoaded, setLoaded] = useState(false);

  const itemRefs: Array<React.RefObject<HTMLDivElement>> = [];
  // tslint:disable-next-line prefer-for-of
  for (let i = 0; i < notifications.length; i++) {
    itemRefs.push(React.createRef());
  }

  function abortRunningNotificationRequest() {
    if (abortController) {
      abortController.abort();
    }
  }

  const loadNots = () => {
    if (loadingCounter > 0) return;
    increaseLoadingCounter();
    const controller = new AbortController();
    setAbortController(controller);
    return github.getUnreadNotifications(props.repos, { signal: controller.signal })
      .then(nots => {;
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
            const notification = new Notification(`${newNotifications.length} GitHub changes`, {
              body: newNotifications.map(n => `* ${n.subject.title}`).join('\n'),
              icon: '/octozero.png',
            });
            notification.onclick = function() {
              window.focus();
              this.close();
            };
          }
          setLastWebNotificationShown(moment());
        }
        props.onNotificationsChange(nots);
        setNotifications(nots);
        setLoaded(true);
      }).finally(() => {
        setAbortController(null)
        decreaseLoadingCounter();
      });
  };

  const checkNotification = async (notification: NotificationType, unsubscribe: boolean = false) => {
    abortRunningNotificationRequest();
    increaseLoadingCounter();
    setNotifications(notifications.filter(n => n.id !== notification.id));
    await github.markNotificationAsRead(notification.id);
    if (unsubscribe) {
      await github.unsubscribeNotification(notification);
    }
    decreaseLoadingCounter();
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
      {loadingCounter > 0 && (
        <EuiPortal>
          <EuiProgress size="xs" color="accent" position="fixed" />
        </EuiPortal>
      )}
      {hasLoaded && visibleNotifications.length === 0 && (
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
          onMute={() => checkNotification(notification, true)}
        />
      ))}
    </div>
  );
}
