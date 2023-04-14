import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncIntegrationComponent, AsyncConfigComponent, AsyncOfficeComponent, AsyncHomepageSettingComponent } from '../../components/AsyncComponent/AsyncComponent';
import UActivity from './uactivity';


// async components


const office = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/integration`} />
         <Route path={`${match.url}/integration`} component={AsyncIntegrationComponent} />
         <Route path={`${match.url}/config`} component={AsyncConfigComponent} />
         <Route path={`${match.url}/office`} component={AsyncOfficeComponent} />
         <Route path={`${match.url}/homepage`} component={AsyncHomepageSettingComponent} />
         <Route path={`${match.url}/uactivity`} component={UActivity} />
      </Switch>
   </div>
);

export default office;