import React from 'react';

import {
  EuiDescriptionList,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';

import { Key } from '../key';
import { HelpSection } from './help-section';

interface HelpProps {
  onClose: () => void;
}

function KeyboardShortcutHelp() {
  const shortcuts = [
    {
      title: (
        <>
          <Key>j</Key>/<Key>↓</Key> + <Key>k</Key>/<Key>↑</Key>
        </>
      ),
      description: 'Navigate through notifications',
    },
    {
      title: <Key>r</Key>,
      description: 'Reload notifications',
    },
    {
      title: (
        <>
          <Key>Enter</Key> + <Key>Escape</Key>
        </>
      ),
      description: 'Show/hide notification details',
    },
    {
      title: <Key>e</Key>,
      description: 'Archive selected notification',
    },
    {
      title: <Key>o</Key>,
      description: 'Open on GitHub',
    },
    {
      title: <Key>m</Key>,
      description: 'Mute/Unsubscribe selected notification',
    },
    {
      title: <Key>.</Key>,
      description: 'Show/hide original issue/PR comment',
    },
  ];
  return (
    <HelpSection title="Keyboard Shortcuts" id="keyboardShortcuts">
      <EuiDescriptionList
        type="column"
        listItems={shortcuts}
        titleProps={{ style: { width: '30%', fontWeight: 'normal' } }}
        descriptionProps={{ style: { width: '70%' } }}
      />
    </HelpSection>
  );
}

export function Help({ onClose }: HelpProps) {
  return (
    <EuiOverlayMask>
      <EuiModal onClose={onClose}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Help</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <KeyboardShortcutHelp />
        </EuiModalBody>
      </EuiModal>
    </EuiOverlayMask>
  );
}
