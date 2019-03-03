import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import { Header } from './components/header';
import { Login } from './components/login';
import { Settings } from './components/settings';
import { useLogin } from './services/login';

import '@elastic/eui/dist/eui_theme_light.css';

function App() {
  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route
          path="/settings/:page?"
          render={({ match }) => <Settings page={match.params.page} />}
        />
        <Route component={Dashboard} />
      </Switch>
    </React.Fragment>
  );
}

function Root() {
  const loginToken = useLogin();
  return (
    <Router>
      <Switch>
        <Route path="/login" render={() => (loginToken ? <Redirect to="/inbox" /> : <Login />)} />
        <Route render={() => (loginToken ? <App /> : <Redirect to="/login" />)} />
      </Switch>
    </Router>
  );
}

export default Root;
