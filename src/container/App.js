/**
 * App.js Layout Start Here
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

// rct theme provider
import RctThemeProvider from "./RctThemeProvider";

//Main App
import RctDefaultLayout from "./DefaultLayout";

// app signin
import AppSignIn from "./SignIn";

import NotFoundPage from '../routes/error/NotFoundPage';

//session
import { getCookie } from "../helpers/session";

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest }) => (
  // <Route
  //    {...rest}
  //    render={props =>
  //       authUser
  //          ? <Component {...props} />
  //          : <Redirect
  //             to={{
  //                pathname: '/signin',
  //                state: { from: props.location }
  //             }}
  //          />}
  // />;
  <Route
    {...rest}
    render={props =>
      getCookie("2stay_token") ? <Component {...props} /> : <Redirect to={`/login`} />
    }
  />
);

class App extends Component {
  
  render() {
    
    const { location, match, authUserRes } = this.props;
    if (location.pathname === "/") {
      return <Redirect to={"/app/dashboard"} />;
    }
    return (
      <RctThemeProvider>
        <NotificationContainer />
        <InitialPath
          path={`${match.url}app`}
          authUser={authUserRes.data}
          component={RctDefaultLayout}
        />
        <Route exact path="/login" component={AppSignIn} />
      </RctThemeProvider>
    );
  }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
  return { authUserRes: authUser };
};

export default connect(mapStateToProps)(App);
