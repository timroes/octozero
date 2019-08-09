import React from 'react';

import { EuiFormRow, EuiSwitch } from '@elastic/eui';
import { useSetting } from '../../services/settings';

import css from './settings.module.scss';

export function GeneralSettings() {
  const [showInitialComment, setShowInitialComment] = useSetting(
    'general_showInitialCommentByDefault'
  );
  const [highlightMentions, setHighlightMentions] = useSetting(
    'general_highlightMentions'
  );

  return (
    <React.Fragment>
      <h1 className={css.settings__title}>General Settings</h1>
      <EuiFormRow>
        <EuiSwitch
          label="Show original issue/PR comment by default"
          checked={showInitialComment}
          onChange={ev => setShowInitialComment(ev.target.checked)}
        />
      </EuiFormRow>
      <EuiFormRow>
        <EuiSwitch
          label="Highlight notifications caused by personal mentions"
          checked={highlightMentions}
          onChange={ev => setHighlightMentions(ev.target.checked)}
        />
      </EuiFormRow>
    </React.Fragment>
  );
}
