import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components

import { AsyncMessagesComponent, AsyncSubcriberMessagesComponent,  } from '../../components/AsyncComponent/AsyncComponent';

const Orders = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/messages`} />
         <Route path={`${match.url}/messages`} component={AsyncMessagesComponent} />
         <Route path={`${match.url}/subscribers`} component={AsyncSubcriberMessagesComponent} />
      </Switch>
   </div>
);

export default Orders;