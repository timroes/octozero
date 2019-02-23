import { EuiBadge, EuiButtonIcon, EuiProgress } from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { GitHubContext } from '../../services/github';
import { Comment, Issue, Notification } from '../../types';
import { Comments } from '../comments';
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

    const [comments, setComments] = useState<Comment[] | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const loadComments = async () => {
      setLoading(true);
      setComments(
        await github.loadComments(
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
        {isLoading && <EuiProgress position="absolute" color="subdued" size="xs" />}
        <NotificationIcon
          type={'base' in issue ? 'pr' : 'issue'}
          state={'merged' in issue && issue.merged ? 'merged' : issue.state}
        />
        {notification.subject.title}
        <EuiBadge color="hollow">
          {notification.repository.owner.login}/{notification.repository.name}
        </EuiBadge>
        {issue.labels.map(label => (
          <EuiBadge key={label.id} color={`#${label.color}`}>
            {label.name}
          </EuiBadge>
        ))}
        <EuiButtonIcon iconType="check" aria-label="Done" onClick={() => onCheck()} />
        <EuiButtonIcon
          iconType="popout"
          aria-label="Open on GitHub"
          onClick={() => window.open(issue.html_url)}
        />
        {open && <div>{comments && <Comments comments={comments} />}</div>}
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
