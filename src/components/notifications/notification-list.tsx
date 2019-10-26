import { EuiEmptyPrompt, EuiPortal, EuiProgress } from '@elastic/eui';
import Octokit from '@octokit/rest';
import moment from 'moment';
import React from 'react';
import { GitHubContext, getSetting } from '../../services';
import { Notification as NotificationType } from '../../types';
import { NotificationItem } from './notification';
import debounce from 'lodash.debounce';
import { EuiLoadingSpinner } from '@elastic/eui';

interface NotificationListProps {
  repos?: Octokit.ActivityListNotificationsForRepoParams[],
  onNotificationsChange: (nots: NotificationType[]) => void;
}

interface State {
  notifications?: NotificationType[];
  lastWebNotificationShown: moment.Moment;
  focusedItem: number;
  isLoading: boolean;
}

export class NotificationList extends React.Component<NotificationListProps, State> { 
  static contextType = GitHubContext;
  context!: React.ContextType<typeof GitHubContext>;

  private notificationsRequestAbort?: AbortController;
  private loadingCounter: number = 0;
  private intervalRefreshId?: number;
  private itemRefs: Array<React.RefObject<HTMLDivElement>> = [];

  constructor(props: NotificationListProps) {
    super(props);
    this.state = {
      lastWebNotificationShown: moment(),
      focusedItem: -1,
      isLoading: true,
    }
  }

  private setLoadingState() {
    this.setState({
      isLoading: this.loadingCounter > 0 || Boolean(this.notificationsRequestAbort),
    });
  }

  private async checkNotification(notification: NotificationType, unsubscribe: boolean = false) {
    // In case the user checks a notification we cancel any pending and abort tunning notifications load
    if (this.notificationsRequestAbort) {
      this.notificationsRequestAbort.abort();
    }
    this.debouncedLoadNotifications.cancel();
    this.loadingCounter++;
    this.setLoadingState();
    this.setState(prevState => ({
      // We know that notifications is always defined here, because we can only call this method once it got defined
      notifications: prevState.notifications!.filter(n => n.id !== notification.id),
    }));
    await this.context.markNotificationAsRead(notification.id);
    if (unsubscribe) {
      await this.context.unsubscribeNotification(notification);
    }
    this.loadingCounter--;
    this.setLoadingState();
    this.debouncedLoadNotifications();
  };

  private loadNotifications = async () => {
    if (this.loadingCounter > 0 || this.notificationsRequestAbort) {
      // If there is already a checking request running, don't try to load notifications
      return;
    }

    this.notificationsRequestAbort = new AbortController();
    this.setLoadingState();
    return this.context.getUnreadNotifications(this.props.repos, { signal: this.notificationsRequestAbort.signal })
      .then(nots => {;
        // TODO: This should be extracted to a better place
        if (getSetting('notifications_active')) {
          const newNotifications: NotificationType[] = [];
          for (const n of nots) {
            if (this.state.lastWebNotificationShown.isAfter(n.updated_at)) {
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
          this.setState({
            lastWebNotificationShown: moment(),
          });
        }
        this.props.onNotificationsChange(nots);
        this.setState({
          notifications: nots,
        });
      }).finally(() => {
        this.notificationsRequestAbort = undefined;
        this.setLoadingState();
      });
  }

  private debouncedLoadNotifications = debounce(this.loadNotifications, 1000);

  private onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Down': // IE/Edge Workaround
      case 'ArrowDown':
      case 'j':
        event.preventDefault();
        event.stopPropagation();
        this.focusChild(this.state.focusedItem + 1);
        break;
      case 'Up': // IE/Edge workaround
      case 'ArrowUp':
      case 'k':
        event.preventDefault();
        event.stopPropagation();
        this.focusChild(this.state.focusedItem - 1);
        break;
      case 'r':
        this.loadNotifications();
        break;
    }
  };

  private focusChild(index: number) {
    if (index >= 0 && index < this.itemRefs.length) {
      const toFocus = this.itemRefs[index].current;
      if (toFocus) {
        toFocus.focus();
      }
    }
  };

  componentDidMount() {
    this.intervalRefreshId = window.setInterval(this.loadNotifications, 60000);
    this.loadNotifications();
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalRefreshId);
  }

  componentDidUpdate() {
    this.focusChild(this.state.focusedItem);
  }

  render() {
    const { notifications, isLoading } = this.state;
    if (!notifications) {
      return <EuiLoadingSpinner size="m" />;
    }
    this.itemRefs = [];
    for (let i = 0; i < notifications.length; i++) {
      this.itemRefs.push(React.createRef());
    }
    const visibleNotifications = notifications.filter(notification =>
      ['Issue', 'PullRequest'].includes(notification.subject.type)
    );
    return (
      <div tabIndex={0} onKeyDown={this.onKeyDown}>
        {isLoading && (
          <EuiPortal>
            <EuiProgress size="xs" color="accent" position="fixed" />
          </EuiPortal>
        )}
        {visibleNotifications.length === 0 && (
          <EuiEmptyPrompt
            iconType="faceHappy"
            title={<h2>You have no unread notifications</h2>}
            body={<p>Enjoy your day!</p>}
          />
        )}
        {visibleNotifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            ref={this.itemRefs[index]}
            notification={notification}
            initialOpen={false}
            onFocus={() => this.setState({ focusedItem: index })}
            onCheck={() => this.checkNotification(notification)}
            onMute={() => this.checkNotification(notification, true)}
          />
        ))}
      </div>
    );
  }
}
