import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DisplayProducts from './components/ProductSelectionPage/ProduceProductSelection/displayProduct';
import Store from './components/Store/Store';
import Landing from './components/Home/Landing';
import Login from '../src/manifest/Login'
import Signup from './components/SignUp/Signup';
import SocialSignUp from './components/SignUp/SocialSignUp';
import AuthAdminRoute from './auth/AuthAdminRoute';
import AuthAdminLoginRoute from './auth/AuthAdminLoginRoute';
import AdminSocialSignup from './components/Admin/AdminSocialSignup';
import AdminSignup from './components/Admin/AdminSignup';
import AdminLogin from './components/LogIn/AdminLogin';
import Admin from './components/Admin/Admin';
import ProfileInfo from './components/Profile-Info/ProfileInfo';
import TermsAndConditions from './components/TermsAndConditions/TermsAndConditions';
import MobilePaypalCheckout from './mobile/MobilePaypalCheckout';
import MainPage from '../src/manifest/OldManifest/Main';
import Home from 'manifest/Home/Home'
import Matts from './Matts/Matts_v3'
// Nav here will take all the adress from children page to this and give
// it to the switch route

function Nav(authLevel, isAuth) {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/main" component={MainPage} />
      <Route exact path="/matts" component={Matts} />
      {/* <Route exact path="/signup" component={Signup} />
      <Route exact path="/socialsignup" component={SocialSignUp} />
      <Route exact path="/products" component={DisplayProducts} />
      <Route exact path="/store" component={Store} />
      <Route exact path="/profile-info" component={ProfileInfo} />
      <Route exact path="/terms-and-conditions" component={TermsAndConditions}/>
      <Route path="/payment/paypal:props" component={MobilePaypalCheckout} />
      <AuthAdminRoute
        path="/admin"
        component={Admin}
        auth={isAuth}
        authLevel={authLevel}
      />
      <AuthAdminLoginRoute
        path="/adminlogin"
        component={AdminLogin}
        auth={isAuth}
      />
      <AuthAdminLoginRoute
        path="/socialsignup"
        component={AdminSocialSignup}
        auth={isAuth}
      />
      <AuthAdminLoginRoute
        path="/signup"
        component={AdminSignup}
        auth={isAuth}
      />
      <Route path="*">
        <Redirect to="/" />
      </Route> */}
    </Switch>
  );
}

export default Nav;
