import '@elastic/eui/dist/eui_theme_light.css';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import { Login } from './components/login';
import { useLogin } from './services/login';

function App() {
  const loginToken = useLogin();
  return (
    <Router>
      <Switch>
        <Route path="/login" render={() => (loginToken ? <Redirect to="/inbox" /> : <Login />)} />
        <Route render={() => (loginToken ? <Dashboard /> : <Redirect to="/login" />)} />
      </Switch>
    </Router>
  );
}

export default App;
