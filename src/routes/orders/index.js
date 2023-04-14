import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import StayOrders from './stay';
import TransportOrders from './transport';
import FlightOrders from './flight';
import  StayDetailOrder from './stay/StayDetailOrder';
import Combo from './combo'

// async components

import {
   AsyncToursComponent,
   AsyncFlightComponent,
   AsyncHotelComponent,
   AsyncInquiryComponent,
   AsyncAttractionOrderComponent,
   AsyncCitiescapeOrderComponent,
   AsyncOrderEventComponent, AsyncOrderVoucherComponent
} from '../../components/AsyncComponent/AsyncComponent';
import FlightOrderDetail from './flight/FlightOrderDetail';

const Orders = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/tours`} />
         <Route path={`${match.url}/attraction`} component={AsyncAttractionOrderComponent} />
         <Route path={`${match.url}/cities_escape`} component={AsyncCitiescapeOrderComponent} />
         <Route path={`${match.url}/tours`} component={AsyncToursComponent} />
         {/* <Route path={`${match.url}/flight`} component={AsyncFlightComponent} /> */}
         <Route path={`${match.url}/hotel`} component={AsyncHotelComponent} />
         <Route path={`${match.url}/event`} component={AsyncOrderEventComponent} />
         <Route path={`${match.url}/voucher`} component={AsyncOrderVoucherComponent} />
         <Route path={`${match.url}/inquiry`} component={AsyncInquiryComponent} />
         <Route exact path={`${match.url}/stay`} component={StayOrders} />
         <Route exact path={`${match.url}/combo`} component={Combo} />
         <Route exact path={`${match.url}/stay/:id`} component={StayDetailOrder} />
         <Route path={`${match.url}/transfer`} component={TransportOrders} />
         <Route exact path={`${match.url}/flight`} component={FlightOrders} />
         <Route exact path={`${match.url}/flight/:id`} component={FlightOrderDetail} />
      </Switch>
   </div>
);

export default Orders;