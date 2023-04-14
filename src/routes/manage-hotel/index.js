import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageHotelDetail from "Routes/manage-hotel/detail";
import HotelManagerComponent from "Routes/manage-hotel/hotel";

// async components

const HotelManager = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Route exact path={`${match.url}`} component={HotelManagerComponent} />
            <Route exact path={`${match.url}/:id`} component={ManageHotelDetail} />

        </Switch>
    </div>
);

export default HotelManager;