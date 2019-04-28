import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import {
  EuiAvatar,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiLoadingSpinner,
  EuiPopover,
} from '@elastic/eui';

import { useGitHub } from '../../services/github';
import { User } from '../../types';

import { Help } from '../help';

import css from './header.module.scss';

export function HeaderComponent(props: RouteComponentProps) {
  const github = useGitHub();
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isHelpShown, setHelpShown] = useState(false);

  const loadUser = async () => {
    setUser(await github.getUser());
  };

  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userButton = (
    <EuiHeaderSectionItemButton onClick={() => setUserMenuOpen(true)}>
      {user ? (
        <EuiAvatar name={user.login} imageUrl={user.avatar_url} />
      ) : (
        <EuiLoadingSpinner size="m" />
      )}
    </EuiHeaderSectionItemButton>
  );

  const userMenuItems = [
    <EuiContextMenuItem
      key="settings"
      icon="gear"
      onClick={() => {
        setUserMenuOpen(false);
        props.history.push('/settings');
      }}
    >
      Settings
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="help"
      icon="help"
      onClick={() => {
        setUserMenuOpen(false);
        setHelpShown(true);
      }}
    >
      Help
    </EuiContextMenuItem>,
  ];

  return (
    <div className={css.header}>
      <EuiHeaderSection side="left" grow={true}>
        <EuiHeaderSectionItem border="none">
          <Link to="/">OctoZero</Link>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection side="right">
        <EuiHeaderSectionItem>
          <EuiPopover
            button={userButton}
            id="userMenu"
            isOpen={isUserMenuOpen}
            closePopover={() => setUserMenuOpen(false)}
            anchorPosition="downLeft"
            panelPaddingSize="none"
          >
            <EuiContextMenuPanel items={userMenuItems} />
          </EuiPopover>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      {isHelpShown && <Help onClose={() => setHelpShown(false)} />}
    </div>
  );
}

export const Header = withRouter(HeaderComponent);
