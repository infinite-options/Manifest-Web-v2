import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../src/manifest/Login';
import Home from '../src/Home/Home';
import History from './Matts/Matts_v6';
import SignUp from '../src/manifest/SignUp';
import AboutModal from 'manifest/Home/About';
import GoalHome from '../src/Home/GoalHome';
import Events from '../src/Home/Events';
import GoogleEventComponent  from './Home/GoogleEventComponent';
// Nav here will take all the adress from children page to this and give
// it to the switch route

function Nav(authLevel, isAuth) {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/events" component={Events} />
      <Route exact path="/eventcomponent" component={GoogleEventComponent} />
      <Route exact path="/goalhome" component={GoalHome} />
      <Route exact path="/history" component={History} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/about" component={AboutModal} />
    </Switch>
  );
}

export default Nav;
