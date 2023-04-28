import React, { useState, useEffect } from 'react';
import './App.css';

import LoginContext, { LoginInitState } from 'LoginContext';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

/* Importing the custom pages as each components */
import { Navigation } from './Home/navigation';
import Nav from '../src/Nav';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import UserSignUp from './manifest/UserSignUp';
import Login from 'manifest/Login';
import Landing from '../src/manifest/Landing';
import SignUp from '../src/manifest/SignUp';
import UploadCSV from 'Home/Upload';
import Download from 'Home/Download';

/* Main function for all the pages and elements */
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
function getFaviconEl() {
  return document.getElementById('favicon');
}

export default function App() {

  const [loginState, setLoginState] = useState(LoginInitState);
  const isSignedIn = loginState.loggedIn;
  console.log('login State App.js', loginState.loggedIn);
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
        {isSignedIn ? (
          <>
            <Navigation />
            <Nav />
          </>) : (
            <>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/addUser" component={UserSignUp} />
              <Route exact path="/download" component={Download} /> 
              <Route exact path="/uploadCSV" component={UploadCSV} />
            </>
        )}
          </LoginContext.Provider>
    </Router>
  );
}
