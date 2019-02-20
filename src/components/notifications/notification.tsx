import React, { useState, useContext, useEffect } from 'react';
import Octokit from '@octokit/rest';
import {
  EuiBadge,
  EuiButtonIcon,
  EuiIcon,
  EuiProgress,
} from '@elastic/eui';

import { GitHubContext } from '../../contexts/github';
import { Comment } from '../../types';

import css from './notification.module.scss';
import { Comments } from '../comments';

interface NotificationItemProps {
  notification: Octokit.ActivityListNotificationsForRepoResponseItem;
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

  const [issue, setIssue] = useState<Octokit.IssuesGetResponse | Octokit.PullsGetResponse | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);

  // TODO: Extract to API
  const loadIssue = async () => {
    const issue: Octokit.Response<Octokit.IssuesGetResponse> = await github.api.request(notification.subject.url);
    setIssue(issue.data);
  };

  // TODO: Extract to API
  const loadComments = async () => {
    if (issue) {
      const comments = await github.loadComments(
        notification.repository.owner.login,
        notification.repository.name,
        issue.number,
        notification.last_read_at
      );
      setComments(comments);
    }
  };
  
  useEffect(() => {
    loadIssue()
  }, [true]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        setOpen(false);
        break;
      case 'e':
        event.preventDefault();
        event.stopPropagation();
        onCheck();
        break;
      case 'o':
        if (issue) {
          window.open(issue.html_url);
        }
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
      { issue && 'base' in issue && 
        <EuiIcon type="editorCodeBlock" />
      }
      {notification.subject.title}
      <EuiBadge
        color="hollow"
      >
        {notification.repository.owner.login}/{notification.repository.name}
      </EuiBadge>
      { issue &&
        issue.labels.map(label => (
          <EuiBadge
            key={label.id}
            color={`#${label.color}`}
          >
            {label.name}
          </EuiBadge>
        ))
      }

      <EuiButtonIcon
        iconType="check"
        aria-label="Done"
        onClick={() => onCheck()}
      />
      { issue &&
        <EuiButtonIcon
          iconType="popout"
          aria-label="Open on GitHub"
          onClick={() => window.open(issue.html_url)}
        />
      }
      { open &&
        <div>
          {!comments && <EuiProgress position="absolute" color="subdued" size="xs" />}
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