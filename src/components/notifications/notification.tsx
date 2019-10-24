import { EuiAvatar, EuiBadge, EuiButtonIcon, EuiProgress } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import className from 'classnames';
import { useGitHub, useSetting } from '../../services';
import { Comment, Event, Issue, Notification } from '../../types';
import { Changes } from '../changes';
import { CommentContent } from '../comments';
import { IssueIcon } from '../issues';
import css from './notification.module.scss';
import { ReasonIcon } from './reason-icon';

interface NotificationItemProps {
  notification: Notification;
  onCheck: () => void;
  onFocus: () => void;
  onMute: () => void;
  initialOpen?: boolean;
}

interface NotificationItemComponentProps extends NotificationItemProps {
  issue: Issue;
}

const NotificationItemComponent = React.forwardRef<HTMLDivElement, NotificationItemComponentProps>(
  ({ notification, issue, onCheck, initialOpen, onFocus, onMute }, ref) => {
    const github = useGitHub();
    const [open, setOpen] = useState(initialOpen);
    const [showInitialCommentSetting] = useSetting('general_showInitialCommentByDefault');
    const [highlightMentions] = useSetting('general_highlightMentions');
    const [showInitialComment, setShowInitialComment] = useState(showInitialCommentSetting);

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

    const markAsDone = (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setLoading(true);
      onCheck();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'Escape':
          setOpen(false);
          break;
        case 'e':
          markAsDone(event);
          break;
        case 'o':
          window.open(issue.html_url);
          break;
        case 'm':
          setLoading(true);
          onMute();
          break;
        case '.':
          setShowInitialComment(!showInitialComment);
          break;
        case 'Enter':
        case 'Return':
          setOpen(true);
          loadComments();
          break;
      }
    };

    const isHighlighted = highlightMentions && notification.reason === 'mention';

    const titleClass = className(css.notification__title, {
      [css['notification__title--highlight']]: isHighlighted,
    });

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
          <ReasonIcon reason={notification.reason} highlight={isHighlighted} />
          <IssueIcon issue={issue} />
          <span className={css.notification__description}>
            <h2 className={titleClass}>{notification.subject.title}</h2>
            {issue.labels.map(label => (
              <EuiBadge key={label.id} color={`#${label.color}`}>
                {label.name}
              </EuiBadge>
            ))}
          </span>
          <span className={css.notification__repo}>
            <img
              src={notification.repository.owner.avatar_url}
              alt=""
              aria-hidden="true"
              className={css.notification__repoIcon}
            />
            {notification.repository.owner.login}/{notification.repository.name}
          </span>
          <EuiAvatar type="space" imageUrl={issue.user.avatar_url} name={issue.user.login} size="s" className={css.notification__author} />
          <EuiButtonIcon iconType="check" aria-label="Done" onClick={markAsDone} />
          <EuiButtonIcon
            iconType="popout"
            aria-label="Open on GitHub"
            onClick={() => window.open(issue.html_url)}
          />
        </div>
        {open && (
          <div className={css.notification__content}>
            {showInitialComment && (
              <>
                <CommentContent author={issue.user} time={issue.created_at} body={issue.body} />
                <div className={css.notification__ellipsis}>⋮</div>
              </>
            )}
            {changes && <Changes changes={changes} issue={issue} />}
          </div>
        )}
      </div>
    );
  }
);

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  (props, ref) => {
    const github = useGitHub();
    const [issue, setIssue] = useState<Issue | null>(null);

    useEffect(
      () => {
        github.getIssueForNotification(props.notification).then(setIssue);
      },
      // Reason: The notification object might change on every refresh, but we don't need to refresh the issue as
      // long as the underlying notification is the same (same id and same updated_at).
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [github, props.notification.id, props.notification.updated_at]
    );

    if (!issue) {
      return null;
    }

    return <NotificationItemComponent ref={ref} issue={issue} {...props} />;
  }
);
