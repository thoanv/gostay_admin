import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncFileManagerComponent } from '../../components/AsyncComponent/AsyncComponent';

// async components


const FileManager = ({ match }) => (
   <div className="dashboard-wrapper">
      <Switch>
         <Route path={`${match.url}`} component={AsyncFileManagerComponent} />
      </Switch>
   </div>
);

export default FileManager;