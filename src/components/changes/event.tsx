import { EuiBadge } from '@elastic/eui';
import Octicon, {
  CircleSlash,
  Eye,
  Icon,
  Person,
  PrimitiveDot,
  RepoPush,
  Tag,
} from '@githubprimer/octicons-react';
import className from 'classnames';
import moment from 'moment';
import React from 'react';

import {
  AssignEvent,
  Event,
  LabelEvent,
  ReviewRequestedEvent as ReviewRequestedEventType,
} from '../../types';

import css from './event.module.scss';

interface BaseComponentProps {
  icon: Icon;
  color?: 'red' | 'green';
  children: React.ReactNode;
}

function BaseComponent({ icon, color, children }: BaseComponentProps) {
  const iconClass = className(css.event__icon, {
    [css['event__icon--red']]: color === 'red',
    [css['event__icon--green']]: color === 'green',
  });
  return (
    <React.Fragment>
      <span className={iconClass}>
        <Octicon icon={icon} />
      </span>
      {children}
    </React.Fragment>
  );
}

function ClosedEvent({ event }: EventProps) {
  return (
    <BaseComponent icon={CircleSlash} color="red">
      {event.actor.login} closed this{' '}
      {event.commit_id && <React.Fragment>via {event.commit_id} </React.Fragment>}
      {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function ReopenedEvent({ event }: EventProps) {
  return (
    <BaseComponent icon={PrimitiveDot} color="green">
      {event.actor.login} reopened this {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function LabeledEvent({ event }: EventProps) {
  // We now we're only using that component below in case we're having a label event.
  const label = (event as LabelEvent).label;
  return (
    <BaseComponent icon={Tag}>
      {event.actor.login} added the{' '}
      <EuiBadge className={css.event__label} color={`#${label.color}`}>
        {label.name}
      </EuiBadge>
      label {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function UnlabeledEvent({ event }: EventProps) {
  // We now we're only using that component below in case we're having a label event.
  const label = (event as LabelEvent).label;
  return (
    <BaseComponent icon={Tag}>
      {event.actor.login} removed the{' '}
      <EuiBadge className={css.event__label} color={`#${label.color}`}>
        {label.name}
      </EuiBadge>
      label {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function HeadRefForcePushedEvent({ event }: EventProps) {
  return (
    <BaseComponent icon={RepoPush}>
      {event.actor.login} force-pushed {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function ReviewRequestedEvent({ event }: EventProps) {
  const requestedReviewer = (event as ReviewRequestedEventType).requested_reviewer;
  const reviewRequester = (event as ReviewRequestedEventType).review_requester;
  const requestedTeam = (event as ReviewRequestedEventType).requested_team;
  return (
    <BaseComponent icon={Eye}>
      {reviewRequester.login} requested a review from {requestedReviewer && requestedReviewer.login}
      {requestedTeam && requestedTeam.name} {moment(event.created_at).fromNow()}
    </BaseComponent>
  );
}

function AssignedEvent({ event }: EventProps) {
  const assginee = (event as AssignEvent).assignee;
  const assigner = (event as AssignEvent).assigner;

  return (
    <BaseComponent icon={Person}>
      {assigner.login === assginee.login ? (
        <>
          {assigner.login} self-assigned this {moment(event.created_at).format()}
        </>
      ) : (
        <>
          {assigner.login} assigned {assginee.login} {moment(event.created_at).fromNow()}
        </>
      )}
    </BaseComponent>
  );
}

// Map event names to components to render. Every event not present in this map will be ignored
// and not shown to the user.
const EVENT_COMPONENTS: { [eventName: string]: React.FunctionComponent<EventProps> } = {
  assigned: AssignedEvent,
  closed: ClosedEvent,
  head_ref_force_pushed: HeadRefForcePushedEvent,
  labeled: LabeledEvent,
  reopened: ReopenedEvent,
  review_requested: ReviewRequestedEvent,
  unlabeled: UnlabeledEvent,
};

interface EventProps {
  event: Event;
}

export function EventComponent({ event }: EventProps) {
  const Component = EVENT_COMPONENTS[event.event];
  if (!Component) {
    return null;
  }
  return (
    <div className={css.event}>
      <Component event={event} />
    </div>
  );
}
