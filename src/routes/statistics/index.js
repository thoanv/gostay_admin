import React from 'react';
import Account from './Account';
import Order from './Order';
import Revenue from './Revenue';
import Customer from './Customer';
import { Redirect, Route, Switch } from 'react-router-dom';
import PerformanceRoom from './PerformanceRoom';

const Statistic = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/account`} />
            <Route path={`${match.url}/account`} component={Account} />
            <Route path={`${match.url}/order`} component={Order} />
            <Route path={`${match.url}/revenue`} component={Revenue} />
            <Route path={`${match.url}/revenue_customer`} component={Customer} />
            <Route path={`${match.url}/performance_room`} component={PerformanceRoom} />
        </Switch>
    </div>
);

export default Statistic;