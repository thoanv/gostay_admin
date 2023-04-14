import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components

import {
  AsyncUtilitiesHotelTypeComponent,
  AsyncUtilitiesRoomTypeComponent
} from "../../components/AsyncComponent/AsyncComponent";

const Stay = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/utilities`} />
      
      <Route
        path={`${match.url}/hotel`}
        component={AsyncUtilitiesHotelTypeComponent}
      />
       <Route
        path={`${match.url}/room`}
        component={AsyncUtilitiesRoomTypeComponent}
      />
    </Switch>
  </div>
);

export default Stay;
