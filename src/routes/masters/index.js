import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncCountryComponent, AsyncDestinationComponent, AsyncEmail_TemplatesComponent, AsyncLanguageComponent, AsyncCurrencyComponent ,AsyncContractComponent, AsyncAirlinesMastersComponent, AsyncCategoryMastersComponent, AsyncTravelLocationComponent} from '../../components/AsyncComponent/AsyncComponent';

// async components


const Masters = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/country`} />
         <Route path={`${match.url}/travel-location`} component={AsyncTravelLocationComponent} />
         <Route path={`${match.url}/country`} component={AsyncCountryComponent} />
         <Route path={`${match.url}/currency`} component={AsyncCurrencyComponent} />
         <Route path={`${match.url}/destination`} component={AsyncDestinationComponent} />
         <Route path={`${match.url}/email_templates`} component={AsyncEmail_TemplatesComponent} />
         <Route path={`${match.url}/language`} component={AsyncLanguageComponent} />
         <Route path={`${match.url}/airlines`} component={AsyncAirlinesMastersComponent} />
         {/* <Route path={`${match.url}/category`} component={AsyncCategoryMastersComponent} /> */}

      </Switch>
   </div>
);

export default Masters;