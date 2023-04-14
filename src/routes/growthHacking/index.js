import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Campaign from './campaign';
import CampaignDetail from './campaign/CampaignDetail';
import CampaignForm from './campaign/CampaignForm';

// async components


const GrowthHacking = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/campaigns`} />
         <Route exact path={`${match.url}/campaigns`} component={Campaign} />
         <Route exact path={`${match.url}/campaigns/form`} component={CampaignForm} />
         <Route exact path={`${match.url}/campaigns/:id`} component={CampaignDetail} />
      </Switch>
   </div>
);

export default GrowthHacking;