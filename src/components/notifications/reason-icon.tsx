import { EuiToolTip } from '@elastic/eui';
import Octoicon, {
  Comment,
  Eye,
  Flame,
  Icon,
  IssueReopened,
  Mail,
  Mention,
  Organization,
  Pencil,
  Person,
  PrimitiveDot,
  Repo,
  Unmute,
} from '@githubprimer/octicons-react';
import React from 'react';

import css from './reason-icon.module.scss';

const REASON_ICONS: { [reason: string]: Icon } = {
  assign: Person,
  author: Pencil,
  comment: Comment,
  invitation: Mail,
  manual: Unmute,
  mention: Mention,
  review_requested: Eye,
  security_alert: Flame,
  state_change: IssueReopened,
  subscribed: Repo,
  team_mention: Organization,
};

const REASON_LABELS: { [reason: string]: string } = {
  assign: 'You are assigned to this issue.',
  author: 'You created that issue.',
  comment: 'You commented on that issue.',
  invitation: 'You accepted an invitation to contribute to the repository.',
  manual: 'You manually subscribed to the issue.',
  mention: 'You were @mentioned in this issue.',
  review_requested: 'Your review was requested on this PR.',
  security_alert: 'Security vulnerability',
  state_change: 'You changed the status of the issue (e.g. closing or merging it).',
  subscribed: 'You subscribed to this repository.',
  team_mention: 'You were on a team that was mentioned.',
};

interface ReasonIconProps {
  reason: string;
}

export function ReasonIcon({ reason }: ReasonIconProps) {
  const Ic = REASON_ICONS[reason] || PrimitiveDot;
  const text = REASON_LABELS[reason] || 'No idea why you are getting this notification ¯\\_(ツ)_/¯';
  return (
    <EuiToolTip content={text} position="right">
      <span className={css['reason-icon']}>
        <Octoicon icon={Ic} />
      </span>
    </EuiToolTip>
  );
}
