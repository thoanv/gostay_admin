/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
// css
import './lib/reactifyCss';
import "antd/dist/antd.css";
import 'suneditor/dist/css/suneditor.min.css';
import '../public/master.css';
import './assets/css/custom.css';
import './assets/font/noir-pro/styles.css';
import 'moment/locale/vi';



// app component
import App from './container/App';

import { configureStore } from './store';

library.add(fab, far, fas);

const MainApp = () => (
	<Provider store={configureStore()}>
		<ConfigProvider locale={viVN}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Router basename="/">
					<Switch>
						<Route path="/" component={App} />
					</Switch>
				</Router>
			</MuiPickersUtilsProvider>
		</ConfigProvider>
	</Provider>
);

export default MainApp;
