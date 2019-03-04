import { useState } from 'react';
import { BehaviorSubject } from 'rxjs';

interface Settings {
  notifications_active: boolean;
}

const settingDefaults: Settings = {
  notifications_active: false,
};

const CONFIG_KEY = 'config';

let storedSettings: Partial<Settings> = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');

const settingsSubject = new BehaviorSubject<Settings>({ ...settingDefaults, ...storedSettings });

function useSetting<T extends keyof Settings>(key: T): [Settings[T], (value: Settings[T]) => void] {
  const [setting, setSettingState] = useState(settingsSubject.getValue()[key]);

  settingsSubject.subscribe(settings => {
    if (settings[key] !== setting) {
      setSettingState(settings[key]);
    }
  });

  const setSetting = (value: Settings[T]) => {
    // Add that setting on top of the currently stored setting (i.e. everything in local storage)
    const newStoredSettings = {
      ...storedSettings,
      [key]: value,
    };
    // Update local storage with that change
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newStoredSettings));
    // Emit that change via our subject to all possible listeners. This will also trigger our own
    // subscription a couple of lines above this, which itself wil update the useState hook, so no
    // need to update that hook here.
    settingsSubject.next({ ...settingDefaults, ...newStoredSettings });
  };

  return [setting, setSetting];
}

window.addEventListener('storage', () => {
  storedSettings = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
  settingsSubject.next({ ...settingDefaults, ...storedSettings });
});

export { useSetting };
