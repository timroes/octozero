import React, { useEffect, useState } from 'react';

import {
  EuiAvatar,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
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
        <EuiHeaderSectionItem border="none">this.productName</EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection side="right">
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
