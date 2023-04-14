import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// async components

import {
  AsyncCarComponent,
  AsyncCarTypeComponent,
  AsyncRouteComponent,
  AsyncRouteDetailComponent,
  AsyncAddRouteComponent,
  AsyncRouteServiceComponent
} from "../../components/AsyncComponent/AsyncComponent";



const Transport = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/car`} />
      <Route exact path={`${match.url}/car`} component={AsyncCarComponent} />
      <Route exact path={`${match.url}/car_type`} component={AsyncCarTypeComponent} />
      <Route exact path={`${match.url}/route_service`} component={AsyncRouteServiceComponent} />
      <Route exact path={`${match.url}/route`} component={AsyncRouteComponent} />
      <Route exact path={`${match.url}/addroute`} component={AsyncAddRouteComponent} />
      <Route exact path={`${match.url}/route/:id`} component={AsyncRouteDetailComponent} />
    </Switch>
  </div>
);

export default Transport;
