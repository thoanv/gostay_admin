import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncGuideComponent, AsyncGuideCalendarComponent, AsyncGitComponent } from '../../components/AsyncComponent/AsyncComponent';

// async components


const Guide = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/guide`} />
         <Route path={`${match.url}/guide`} component={AsyncGuideComponent} />
         <Route path={`${match.url}/guide_calendar`} component={AsyncGuideCalendarComponent} />
         <Route path={`${match.url}/git`} component={AsyncGitComponent} />
      </Switch>
   </div>
);

export default Guide;