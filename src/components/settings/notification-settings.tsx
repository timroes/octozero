import React, { useState } from 'react';

import { EuiFormRow, EuiSwitch } from '@elastic/eui';
import { useSetting } from '../../services/settings';

import css from './settings.module.scss';

export function NotificationSettings() {
  const [permissionError, setPermissionError] = useState(false);
  const [isActive, setIsActive] = useSetting('notifications_active');

  const onNotificationActiveChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const isActivated = ev.target.checked;
    if (!isActivated) {
      // User tries to disable notifications (we can always do that)
      setIsActive(false);
    } else {
      // User tries to active notifications
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsActive(isActivated);
      } else {
        setPermissionError(true);
      }
    }
  };

  return (
    <React.Fragment>
      <h1 className={css.settings__title}>Notification Settings</h1>
      <EuiFormRow
        isInvalid={permissionError}
        error={permissionError && 'Allow this webpage to show notifications to use this feature.'}
      >
        <EuiSwitch
          label="Activate Notifications"
          checked={isActive}
          onChange={onNotificationActiveChange}
        />
      </EuiFormRow>
    </React.Fragment>
  );
}
