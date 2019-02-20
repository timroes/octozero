import React, { useState, useContext, useEffect } from 'react';
import Octokit from '@octokit/rest';
import { GitHubContext } from '../../contexts/github';
import {
  EuiBadge,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiIcon,
  EuiLoadingSpinner,
} from '@elastic/eui';
import { CommentContent } from '../comments/comment-content';

import css from './notification.module.scss';

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
  const [comment, setComment] = useState<Octokit.IssuesGetCommentResponse | null>(null);

  // TODO: Extract to API
  const loadIssue = async () => {
    const issue: Octokit.Response<Octokit.IssuesGetResponse> = await github.api.request(notification.subject.url);
    setIssue(issue.data);
  };

  // TODO: Extract to API
  const loadComments = async () => {
    const comment: Octokit.Response<Octokit.IssuesGetCommentResponse> = await github.api.request(notification.subject.latest_comment_url);
    setComment(comment.data);
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
      onFocus={() => {
        setOpen(true);
        loadComments();
        onFocus();
      }}
    >
      { issue && 'base' in issue && 
        <EuiIcon type="editorCodeBlock" />
      }
      <EuiButtonEmpty
        onClick={() => {
          setOpen(!open);
          loadComments();
        }}
      >
        {notification.subject.title}
      </EuiButtonEmpty>
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
          {!comment && <EuiLoadingSpinner />}
          {comment && 
            <CommentContent
              author={comment.user}
              time={comment.updated_at}
              body={comment.body}
            />
          }
        </div>
      }
    </div>
  );
}); 