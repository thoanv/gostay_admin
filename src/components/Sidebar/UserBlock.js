/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom';
import { setCookie, removeCookie, getCookie } from './../../helpers/session';

import { Avatar } from 'antd';
// components
import SupportPage from '../Support/Support';

// redux action
import { logoutUserFromFirebase } from 'Actions';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import AddAdmin from '../../routes/account/admin/AddAdmin';
import { updateACCOUNT } from '../../actions/AccountAction';
import { checkToken } from '../../actions/AuthActions';



class UserBlock extends Component {

	state = {
		userDropdownMenu: false,
		isSupportModal: false,
		addAccountState: false,
		isSubmiting: false,
		edit: false,
		openRole: false,
		current_account:null
	}

	/**
	 * Logout User
	 */
	async logoutUser() {
		removeCookie('2stay_token');
		// await deleteToken();
		window.location.href = "/login"
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}

	onAccountClose = () => {
		this.setState({
		  addAccountState: false,
		  isSubmiting: false,
		  current_account:null,
		  edit: false
		});
	  };
	  onSaveAccount = async (data, id) => {
		await this.setState({
		  ...this.state,
		  isSubmiting: true
		});
		  var dataSubmit = { ...data, id: id };
		  await this.props
			.updateAccount(dataSubmit)
			.then(res => {
			  this.setState({
				...this.state,
				isSubmiting: false,
				addAccountState: false,
				current_account:null,
				edit: false
			  });
			  this.props.checkToken()
			})
			.catch(err => {
			  this.setState({
				...this.state,
				isSubmiting: false
			  });
			});
		
	  };
	  handleEdit=(data)=>{
		  this.setState({
			  edit: true,
			  addAccountState: true,
			  current_account: data
		  })
	  }
	render() {
		const { authUserRes, config } = this.props;
		
		return (
			<React.Fragment>
				{
					authUserRes.data.image ?
						<div className="top-sidebar">
							<div className="sidebar-user-block">
								<Dropdown
									isOpen={this.state.userDropdownMenu}
									toggle={() => this.toggleUserDropdownMenu()}
									className="rct-dropdown"
								>
									<DropdownToggle
										tag="div"
										className="d-flex align-items-center"
									>
										<div className="user-profile">

											<Avatar size={50} src={config.url_asset_root + authUserRes.data.image} />
										</div>
										<div className="user-info">
											<span className="user-name ml-4">{authUserRes.data.lastname}</span>
											<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
										</div>
									</DropdownToggle>
									<DropdownMenu>
										<ul className="list-unstyled mb-0">
											<li>
												{/* <Link to={{
													pathname: '/app/users/user-profile-1',
													state: { activeTab: 0 }
												}}> */}
												<a onClick={()=>this.handleEdit(authUserRes.data)}>
													<i className="zmdi zmdi-account text-primary mr-3"></i>
													<IntlMessages id="widgets.profile" />
													</a>
												{/* </Link> */}
											</li>
											<li className="border-top">
												<a className="action-link" onClick={() => this.logoutUser()}>
													<i className="zmdi zmdi-power text-danger mr-3"></i>
													<IntlMessages id="widgets.logOut" />
												</a>
											</li>
										</ul>
									</DropdownMenu>
								</Dropdown>
							</div>
							<SupportPage
								isOpen={this.state.isSupportModal}
								onCloseSupportPage={() => this.onCloseSupportPage()}
								onSubmit={() => this.onSubmitSupport()}
							/>
						</div>
						:
						<div className="top-sidebar">
							<div className="sidebar-user-block">
								<Dropdown
									isOpen={this.state.userDropdownMenu}
									toggle={() => this.toggleUserDropdownMenu()}
									className="rct-dropdown"
								>
									<DropdownToggle
										tag="div"
										className="d-flex align-items-center"
									>
										<div className="user-profile">
											<Avatar size={50} src={require('../../assets/img/user.png')} />
										</div>
										<div className="user-info">
											<span className="user-name ml-4">{authUserRes.data.lastname}</span>
											<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
										</div>
									</DropdownToggle>
									<DropdownMenu>
										<ul className="list-unstyled mb-0">
											<li>
											<a onClick={()=>this.handleEdit(authUserRes.data)}>
													<i className="zmdi zmdi-account text-primary mr-3"></i>
													<IntlMessages id="widgets.profile" />
													</a>
											</li>
											<li className="border-top">
												<a className="action-link" onClick={() => this.logoutUser()}>
													<i className="zmdi zmdi-power text-danger mr-3"></i>
													<IntlMessages id="widgets.logOut" />
												</a>
											</li>
										</ul>
									</DropdownMenu>
								</Dropdown>
							</div>
							<SupportPage
								isOpen={this.state.isSupportModal}
								onCloseSupportPage={() => this.onCloseSupportPage()}
								onSubmit={() => this.onSubmitSupport()}
							/>
						</div>
				}
				<AddAdmin
					open={this.state.addAccountState}
					onSaveAccount={this.onSaveAccount}
					onAccountClose={this.onAccountClose}
					loading={this.state.isSubmiting}
					edit={this.state.edit}
					account={this.state.current_account}
				/>
			</React.Fragment>
		);
	}
}

// map state to props
function mapStateToProps(state) {
	return {
		authUserRes: state.authUser,
		config: state.config
	}
}
const mapDispatchToProps = dispatch => {
	return {
	 
	  updateAccount: account => dispatch(updateACCOUNT(account)),
	  checkToken: () => dispatch(checkToken()),
	};
  };
export default connect(mapStateToProps, mapDispatchToProps)(UserBlock);
