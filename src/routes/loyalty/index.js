import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncActivitiesComponent, AsyncRulesComponent, AsyncCouponComponent } from '../../components/AsyncComponent/AsyncComponent';

// async components


const Loyalty = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/rules`} />
         <Route path={`${match.url}/rules`} component={AsyncRulesComponent} />
         <Route path={`${match.url}/activities`} component={AsyncActivitiesComponent} />
         <Route path={`${match.url}/coupon`} component={AsyncCouponComponent} />
      </Switch>
   </div>
);

export default Loyalty;