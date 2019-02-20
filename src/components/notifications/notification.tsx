import React, { useState, useContext } from 'react';
import {
  EuiBadge,
  EuiButtonIcon,
  EuiIcon,
  EuiProgress,
} from '@elastic/eui';

import { GitHubContext } from '../../contexts/github';
import { Comment, Notification } from '../../types';

import css from './notification.module.scss';
import { Comments } from '../comments';

interface NotificationItemProps {
  notification: Notification;
  onCheck: () => void;
  onFocus: () => void;
  initialOpen?: boolean;
}

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>((
  { notification, onCheck, initialOpen, onFocus },
  ref,
) => {
  const github = useContext(GitHubContext);
  const [open, setOpen] = useState(initialOpen);

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const loadComments = async () => {
    setLoading(true);
    const comments = await github.loadComments(
      notification.repository.owner.login,
      notification.repository.name,
      notification.issue.number,
      notification.last_read_at
    );
    setComments(comments);
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
        window.open(notification.issue.html_url);
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
      { isLoading && <EuiProgress position="absolute" color="subdued" size="xs" /> }
      { 'base' in notification.issue && 
        <EuiIcon type="editorCodeBlock" />
      }
      {notification.subject.title}
      <EuiBadge
        color="hollow"
      >
        {notification.repository.owner.login}/{notification.repository.name}
      </EuiBadge>
      { notification.issue.labels.map(label => (
          <EuiBadge
            key={label.id}
            color={`#${label.color}`}
          >
            {label.name}
          </EuiBadge>
        ))}
      <EuiButtonIcon
        iconType="check"
        aria-label="Done"
        onClick={() => onCheck()}
      />
      <EuiButtonIcon
        iconType="popout"
        aria-label="Open on GitHub"
        onClick={() => window.open(notification.issue.html_url)}
      />
      { open &&
        <div>
          {comments && 
            <Comments
              comments={comments}
            />
          }
        </div>
      }
    </div>
  );
});