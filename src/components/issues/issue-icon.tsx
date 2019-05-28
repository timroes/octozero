import Octicon, {
  GitMerge,
  GitPullRequest,
  IssueClosed,
  IssueOpened,
} from '@githubprimer/octicons-react';
import className from 'classnames';
import React from 'react';

import css from './issue-icon.module.scss';
import { Issue, PR } from '../../types';

interface IssueIconProps {
  issue: Issue;
}

function isPr(issue: Issue): issue is PR {
  return 'base' in issue;
}

export function IssueIcon({ issue }: IssueIconProps) {
  const classes = className(css['issue-icon'], {
    [css['issue-icon--open']]: issue.state === 'open',
    [css['issue-icon--closed']]: issue.state === 'closed',
  });
  if (isPr(issue)) {
    const prClasses = className(classes, {
      [css['issue-icon--merged']]: issue.merged,
      [css['issue-icon--draft']]: issue.mergeable_state === 'draft',
    });
    return (
      <span className={prClasses}>
        <Octicon icon={issue.merged ? GitMerge : GitPullRequest} />
      </span>
    );
  } else {
    return (
      <span className={classes}>
        <Octicon icon={issue.state === 'open' ? IssueOpened : IssueClosed} />
      </span>
    );
  }
}
