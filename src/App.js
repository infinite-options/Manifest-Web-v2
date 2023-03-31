import React, { useState, useEffect } from 'react';
import './App.css';

import LoginContext, { LoginInitState } from 'LoginContext';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

/* Importing the custom pages as each components */
import { Navigation } from './Home/navigation';
import Nav from '../src/Nav';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import MiniNavigation from './manifest/miniNavigation';

/* Main function for all the pages and elements */
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
function getFaviconEl() {
  return document.getElementById('favicon');
}
export default function App() {
  const [loginState, setLoginState] = useState(LoginInitState);
  console.log('login State');
  console.log(loginState.loggedIn);
  useEffect(
    () => console.log('curUser = ', loginState.curUser),
    [loginState.curUser]
  );
  useEffect(
    () => console.log('curUserTimeZone = ', loginState.curUserTimeZone),
    [loginState.curUserTimeZone]
  );
  useEffect(
    () => console.log('curUserEmail = ', loginState.curUserEmail),
    [loginState.curUserEmail]
  );
  console.log('base_url', BASE_URL);
  useEffect(() => {
    const favicon = getFaviconEl();
    favicon.href = 'favicon-life.ico';
  }, []);

  return (
    <Router>
      <LoginContext.Provider
        value={{
          loginState: loginState,
          setLoginState: setLoginState,
        }}
      >
        <div>
          <Navigation />
          <Nav />
        </div>
      </LoginContext.Provider>

    </Router>
  );
}
