import { useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

const LOGIN_TOKEN_KEY = 'github_token';

const loginTokenSubject = new BehaviorSubject(localStorage.getItem(LOGIN_TOKEN_KEY));
const loginToken$ = loginTokenSubject.pipe(share());

function getLogin() {
  return loginTokenSubject.getValue();
}

function setLogin(token: string) {
  localStorage.setItem(LOGIN_TOKEN_KEY, token);
  loginTokenSubject.next(token);
}

function useLogin() {
  const [loginToken, setLoginToken] = useState(loginTokenSubject.getValue());
  loginTokenSubject.subscribe(token => {
    if (loginToken !== token) {
      setLoginToken(token);
    }
  });
  return loginToken;
}

window.addEventListener('storage', () => {
  const token = localStorage.getItem(LOGIN_TOKEN_KEY);
  if (token !== loginTokenSubject.getValue()) {
    loginTokenSubject.next(token);
  }
});

export { setLogin, useLogin, loginToken$, getLogin };
