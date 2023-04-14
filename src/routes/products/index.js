import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  AsyncProductComponent,
  AsyncToursProductComponent,
  AsyncHotelsProductComponent,
  AsyncAttractionProductComponent,
  AsyncReviewsProductComponent,
  AsyncFlightProductComponent,
  AsyncCitiesEscapeProductComponent
} from "../../components/AsyncComponent/AsyncComponent";

// async components

const Products = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/tours`} />
      <Route path={`${match.url}/product`} component={AsyncProductComponent} />
      <Route
        path={`${match.url}/tours`}
        component={AsyncToursProductComponent}
      />
      <Route
        path={`${match.url}/hotels`}
        component={AsyncHotelsProductComponent}
      />
      {/* <Route
        path={`${match.url}/category`}
        component={AsyncCategoryProductComponent}
      /> */}
      <Route
        path={`${match.url}/attraction`}
        component={AsyncAttractionProductComponent}
      />
       <Route
        path={`${match.url}/cities_Escape`}
        component={AsyncCitiesEscapeProductComponent}
      />
      <Route
        path={`${match.url}/reviews`}
        
        component={AsyncToursProductComponent}
      />
      <Route
        path={`${match.url}/flight`}
        component={AsyncFlightProductComponent}
      />
    </Switch>
  </div>
);

export default Products;
