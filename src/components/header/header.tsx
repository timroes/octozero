import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  EuiAvatar,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiIcon,
} from '@elastic/eui';

import { useGitHub } from '../../services/github';
import { User } from '../../types';

import css from './header.module.scss';

export function Header() {
  const github = useGitHub();
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    setUser(await github.getUser());
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className={css.header}>
      <EuiHeaderSection side="left" grow={true}>
        <EuiHeaderSectionItem border="none">
          <Link to="/">this.productName</Link>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection side="right">
        <EuiHeaderSectionItem>
          <Link to="/settings" className={css.header__button} aria-label="Settings">
            <EuiIcon type="gear" />
          </Link>
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem>
          {user && (
            <EuiHeaderSectionItemButton>
              <EuiAvatar name={user.login} imageUrl={user.avatar_url} />
            </EuiHeaderSectionItemButton>
          )}
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </div>
  );
}
