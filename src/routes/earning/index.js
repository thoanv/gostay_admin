import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncOverviewComponent, AsyncWithdrawComponent} from '../../components/AsyncComponent/AsyncComponent';

// async components


const Earning = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/overview`} />
         <Route path={`${match.url}/overview`} component={AsyncOverviewComponent} />
         <Route path={`${match.url}/withdraw`} component={AsyncWithdrawComponent} />
        

      </Switch>
   </div>
);

export default Earning;