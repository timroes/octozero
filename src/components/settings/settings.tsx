import { EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import React from 'react';

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
          iconType="bell"
          isActive={true}
          label="Notifications"
          href="/settings/notifications"
        />
      </EuiListGroup>
      <main className={css.settings__main}>
        {(!page || page === 'notifications') && <NotificationSettings />}
      </main>
    </div>
  );
}
