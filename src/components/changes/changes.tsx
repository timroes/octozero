import React from 'react';
import { Comment, Event } from '../../types';
import { CommentContent } from '../comments';
import css from './changes.module.scss';
import { EventComponent } from './event';

function isEvent(change: Comment | Event): change is Event {
  return 'event' in change;
}

interface ChangesProps {
  changes: Array<Comment | Event>;
}

export function Changes({ changes }: ChangesProps) {
  return (
    <div className={css.changes}>
      {changes.map(change =>
        isEvent(change) ? (
          <EventComponent key={change.node_id} event={change} />
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
