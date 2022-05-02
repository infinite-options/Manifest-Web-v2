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
    console.log('base_url', favicon.href);
    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
      console.log('base_url', BASE_URL.substring(8, 18));
      favicon.href = 'favicon.ico';
      console.log('base_url', favicon.href);
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      favicon.href = 'favicon-life.ico';
      console.log('base_url', favicon.href);
    }
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
          {/* <Link to="/login">Login </Link> */}
          {/* <Link to="/">Home</Link> */}

          <Navigation />
          {/* <MiniNavigation /> */}
          {/* <Switch>
          <Route path="/"> */}
          <Nav />
          {/* </Route> */}
          {/* <Route path="/login">
            <Login />
          </Route> */}
          {/* </Switch> */}
        </div>
      </LoginContext.Provider>
    </Router>
    // <div>
    //   {/* <Home /> */}
    //   <Container>
    //     <Row>
    //       <Col>1 of 2</Col>
    //       <Col>2 of 2</Col>
    //     </Row>
    //     <Row>
    //       <Col>1 of 3</Col>
    //       <Col>2 of 3</Col>
    //       <Col>3 of 3</Col>
    //     </Row>
    //   </Container>
    // </div>
  );
}
