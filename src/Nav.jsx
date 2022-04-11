import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../src/manifest/Login';
import Landing from '../src/manifest/Landing';
import Home from '../src/Home/Home';
import History from './History/History';
import SignUp from '../src/manifest/SignUp';
import AboutModal from 'manifest/About/About';
import GoalHome from '../src/Home/GoalHome';
import Events from '../src/Home/Events';
import Privacy from '../src/Home/Privacy';
import GoogleEventComponent from './Home/GoogleEventComponent';
import AboutUs from '../src/manifest/AboutUs';
import UserSignUp from './manifest/UserSignUp';
// Nav here will take all the adress from children page to this and give
// it to the switch route

function Nav(authLevel, isAuth) {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/events" component={Events} />
      <Route exact path="/eventcomponent" component={GoogleEventComponent} />
      <Route exact path="/goalhome" component={GoalHome} />
      <Route exact path="/history" component={History} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/about" component={AboutModal} />
      <Route exact path="/aboutus" component={AboutUs} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/addUser" component={UserSignUp} />
    </Switch>
  );
}

export default Nav;
