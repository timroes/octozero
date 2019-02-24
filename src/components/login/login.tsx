import {
  EuiButton,
  EuiCode,
  EuiFieldPassword,
  EuiForm,
  EuiFormRow,
  EuiPanel,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import React, { FormEvent, useState } from 'react';
import { setLogin } from '../../services/login';

import css from './login.module.scss';

export function Login() {
  const [token, setToken] = useState('');
  const login = (ev: FormEvent) => {
    ev.preventDefault();
    setLogin(token);
  };
  return (
    <EuiPanel hasShadow={true} className={css.login}>
      <form onSubmit={login}>
        <EuiTitle>
          <h1>Login</h1>
        </EuiTitle>
        <EuiText>
          <p>
            To use this tool you'll need to create a{' '}
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferer">
              personal access token
            </a>{' '}
            on GitHub with the <EuiCode>repo</EuiCode> and <EuiCode>notifications</EuiCode>{' '}
            permission.
          </p>
        </EuiText>
        <EuiForm className={css.login__form}>
          <EuiFormRow fullWidth={true} label="Personal Access Token">
            <EuiFieldPassword
              fullWidth={true}
              value={token}
              onChange={ev => setToken(ev.target.value)}
            />
          </EuiFormRow>
          <EuiButton type="submit" color="primary">
            Login
          </EuiButton>
        </EuiForm>
      </form>
    </EuiPanel>
  );
}
