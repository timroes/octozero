import { EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import React from 'react';

import { GeneralSettings } from './general-settings';
import { NotificationSettings } from './notification-settings';

import css from './settings.module.scss';

interface SettingsProps {
  page?: string;
}

export function Settings({ page }: SettingsProps) {
  return (
    <div className={css.settings}>
      <EuiListGroup flush={true} className={css.settings__menu}>
        <EuiListGroupItem
          iconType="gear"
          isActive={page === 'general' || !page}
          label="General"
          href="/settings/general"
        />
        <EuiListGroupItem
          iconType="bell"
          isActive={page === 'notifications'}
          label="Notifications"
          href="/settings/notifications"
        />
      </EuiListGroup>
      <main className={css.settings__main}>
        {(!page || page === 'general') && <GeneralSettings />}
        {page === 'notifications' && <NotificationSettings />}
      </main>
    </div>
  );
}
