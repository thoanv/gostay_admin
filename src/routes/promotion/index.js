import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncListPromotionComponent, AsyncPromotionDetailComponent } from '../../components/AsyncComponent/AsyncComponent';


// async components


const Promotion = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Route path={`${match.url}`} exact component={AsyncListPromotionComponent} />
            {/* <Route path={`${match.url}/:id`} exact component={AsyncPromotionDetailComponent} /> */}
        </Switch> 
    </div>
);

export default Promotion;