import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {  AsyncSale_ReportsComponent, AsyncCusmer_ReporttoComponent } from '../../components/AsyncComponent/AsyncComponent';

// async components


const Reports = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/sale_reports`} />
         <Route path={`${match.url}/sale_reports`} component={AsyncSale_ReportsComponent} />
         <Route path={`${match.url}/customer_report`} component={AsyncCusmer_ReporttoComponent} />
         
       
        
      </Switch>
   </div>
);

export default Reports;