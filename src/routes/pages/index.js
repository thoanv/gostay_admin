import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncPagesComponent } from '../../components/AsyncComponent/AsyncComponent';

// async components


const Pages = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Route path={`${match.url}`} component={AsyncPagesComponent} />
      </Switch>
   </div>
);

export default Pages;