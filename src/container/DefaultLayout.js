/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// app default layout
import RctAppLayout from 'Components/RctAppLayout';

// router service
import routerService from "../services/_routerService";

import NotFoundPage from '../routes/error/NotFoundPage';

import { getCookie } from '../helpers/session';

//firebase
import { sendToken } from '../actions/Notification';

// actions
import { checkToken, _getMyPermission } from '../actions/AuthActions';
import { getConfig } from '../actions/ConfigActions';

class DefaultLayout extends Component {

	async componentDidMount() {
		const tok = getCookie('2stay_token');
		let user_id = "";
		let tokenFCM = "";
		try {
			await this.props.getConfig();
			if (tok) {
				this.props._getMyPermission();
				await this.props.checkToken(tok).then(res => {
					user_id = res.id;
				});
			}
			// await requestPM().then((res) => tokenFCM = res);
			// sendToken({ device_id: tokenFCM, user_id: user_id })
		} catch (error) {

		}

	}

	render() {
		const { match } = this.props;
		const token = getCookie('2stay_token');
		if (token) {
			return (
				<RctAppLayout>
					<Switch>
						{routerService && routerService.map((route, key) =>
							<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
						)}
						<Route component={NotFoundPage} />
					</Switch>
				</RctAppLayout>
			);
		} else {
			return (
				<Redirect to='/login' />
			)
		}

	}
}


function mapDispatchToProps(dispatch) {
	return {
		checkToken: (data) => dispatch(checkToken(data)),
		_getMyPermission: () => dispatch(_getMyPermission()),
		getConfig: () => dispatch(getConfig())
	}
}

function mapStateToProps(state) {
	return {
		authUserRes: state.authUser
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultLayout));
