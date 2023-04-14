import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components

import {
  AsyncPropertyTypeComponent,
  AsyncPropertyComponent,
  AsyncAmenityComponent,
  AsyncRestaurantComponent,
  AsyncRoomComponent,
  AsyncCancelPolicyComponent,
  AsyncRoomUtilTypeComponent,
  AsyncRoomUtilComponent
} from "../../components/AsyncComponent/AsyncComponent";

const Stay = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/stay`} />
      <Route path={`${match.url}/amenity`} component={AsyncAmenityComponent} />
      <Route
        path={`${match.url}/restaurant`}
        component={AsyncRestaurantComponent}
      />
      <Route path={`${match.url}/room`} component={AsyncRoomComponent} />
      <Route
        path={`${match.url}/cancel_policy`}
        component={AsyncCancelPolicyComponent}
      />
      <Route
        path={`${match.url}/property`}
        component={AsyncPropertyComponent}
      />
      <Route
        path={`${match.url}/property_type`}
        component={AsyncPropertyTypeComponent}
      />
       <Route
        path={`${match.url}/room_util_type`}
        component={AsyncRoomUtilTypeComponent}
      />
       <Route
        path={`${match.url}/room_util`}
        component={AsyncRoomUtilComponent}
      />
    </Switch>
  </div>
);

export default Stay;
