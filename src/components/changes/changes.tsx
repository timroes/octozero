import React from 'react';
import { Comment, Event, Issue } from '../../types';
import { CommentContent } from '../comments';
import { EventComponent } from './event';

function isEvent(change: Comment | Event): change is Event {
  return 'event' in change;
}

interface ChangesProps {
  changes: Array<Comment | Event>;
  issue: Issue;
}

export function Changes({ changes, issue }: ChangesProps) {
  return (
    <div>
      {!changes.length && <em>No changes found</em>}
      {changes.map(change =>
        isEvent(change) ? (
          <EventComponent key={change.node_id} event={change} issue={issue} />
        ) : (
          <CommentContent
            key={change.node_id}
            author={change.user}
            time={change.updated_at}
            body={change.body}
          />
        )
      )}
    </div>
  );
}
