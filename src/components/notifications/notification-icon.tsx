import Octicon, {
  GitMerge,
  GitPullRequest,
  IssueClosed,
  IssueOpened,
} from '@githubprimer/octicons-react';
import className from 'classnames';
import React from 'react';

import css from './notification-icon.module.scss';

interface NotificationIconProps {
  type: 'issue' | 'pr';
  state: string;
}

export function NotificationIcon({ type, state }: NotificationIconProps) {
  const classes = className(css['notification-icon'], {
    [css['notification-icon--open']]: state === 'open',
    [css['notification-icon--closed']]: state === 'closed',
    [css['notification-icon--merged']]: state === 'merged',
  });
  if (type === 'issue') {
    return (
      <span className={classes}>
        <Octicon icon={state === 'open' ? IssueOpened : IssueClosed} />
      </span>
    );
  } else {
    return (
      <span className={classes}>
        <Octicon icon={state === 'merged' ? GitMerge : GitPullRequest} />
      </span>
    );
  }
}
