import { EuiBadge, EuiButtonIcon, EuiProgress } from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { GitHubContext } from '../../services/github';
import { Comment, Event, Issue, Notification } from '../../types';
import { Changes } from '../changes';
import { NotificationIcon } from './notification-icon';
import css from './notification.module.scss';

interface NotificationItemProps {
  notification: Notification;
  onCheck: () => void;
  onFocus: () => void;
  initialOpen?: boolean;
}

interface NotificationItemComponentProps extends NotificationItemProps {
  issue: Issue;
}

const NotificationItemComponent = React.forwardRef<HTMLDivElement, NotificationItemComponentProps>(
  ({ notification, issue, onCheck, initialOpen, onFocus }, ref) => {
    const github = useContext(GitHubContext);
    const [open, setOpen] = useState(initialOpen);

    const [changes, setChanges] = useState<Array<Comment | Event> | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const loadComments = async () => {
      setLoading(true);
      setChanges(
        await github.loadIssueChanges(
          notification.repository.owner.login,
          notification.repository.name,
          issue.number,
          notification.last_read_at
        )
      );
      setLoading(false);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          setOpen(false);
          break;
        case 'e':
          event.preventDefault();
          event.stopPropagation();
          setLoading(true);
          onCheck();
          break;
        case 'o':
          window.open(issue.html_url);
          break;
        case 'Enter':
        case 'Return':
          setOpen(true);
          loadComments();
          break;
      }
    };

    return (
      <div
        id={notification.id}
        ref={ref}
        className={css.notification}
        tabIndex={0}
        aria-label={notification.subject.title}
        onKeyDown={onKeyDown}
        onClick={() => {
          setOpen(true);
          loadComments();
        }}
        onFocus={() => {
          onFocus();
        }}
      >
        <div className={css.notification__header}>
          {isLoading && <EuiProgress position="absolute" color="subdued" size="xs" />}
          <NotificationIcon
            type={'base' in issue ? 'pr' : 'issue'}
            state={'merged' in issue && issue.merged ? 'merged' : issue.state}
          />
          <span className={css.notification__description}>
            <h2 className={css.notification__title}>{notification.subject.title}</h2>
            {issue.labels.map(label => (
              <EuiBadge key={label.id} color={`#${label.color}`}>
                {label.name}
              </EuiBadge>
            ))}
          </span>
          <span className={css.notification__repo}>
            <img
              src={notification.repository.owner.avatar_url}
              aria-hidden="true"
              className={css.notification__repoIcon}
            />
            {notification.repository.owner.login}/{notification.repository.name}
          </span>
          <EuiButtonIcon iconType="check" aria-label="Done" onClick={() => onCheck()} />
          <EuiButtonIcon
            iconType="popout"
            aria-label="Open on GitHub"
            onClick={() => window.open(issue.html_url)}
          />
        </div>
        {open && <div>{changes && <Changes changes={changes} />}</div>}
      </div>
    );
  }
);

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  (props, ref) => {
    const github = useContext(GitHubContext);
    const [issue, setIssue] = useState<Issue | null>(null);

    useEffect(() => {
      github.getIssueForNotification(props.notification).then(setIssue);
    }, [props.notification.id]);

    if (!issue) {
      return null;
    }

    return <NotificationItemComponent ref={ref} issue={issue} {...props} />;
  }
);
