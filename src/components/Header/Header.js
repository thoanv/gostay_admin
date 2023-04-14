/**
 * App Header
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import screenfull from "screenfull";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router-dom";
import $ from "jquery";
import Notifications from "./Notifications";

// actions
import { collapsedSidebarAction } from "Actions";

import MobileSearchForm from "./MobileSearchForm";
import Message from "./Message";
// import LanguageProvider from "./LanguageProvider";


class Header extends Component {
  state = {
    customizer: false,
    isMobileSearchFormVisible: false,
    messageList: [],
    filter: { paging: 0 }
  };

  renderMessage() {
    return (
      <Message></Message>
    );
  }


  // function to change the state of collapsed sidebar
  onToggleNavCollapsed = () => {
    const val = !this.props.navCollapsed;
    this.props.collapsedSidebarAction(val);
  };


  // toggle screen full
  toggleScreenFull() {
    screenfull.toggle();
  }

  // mobile search form
  openMobileSearchForm() {
    this.setState({ isMobileSearchFormVisible: true });
  }

  render() {
    const { isMobileSearchFormVisible } = this.state;
    $("body").click(function () {
      $(".dashboard-overlay").removeClass("show");
      $(".dashboard-overlay").addClass("d-none");
      $("body").css("overflow", "");
    });
    const { horizontalMenu, agencyMenu } = this.props;
    return (
      <React.Fragment>


        <AppBar position="static" className="rct-header">
          <Toolbar className="d-flex justify-content-between w-100 pl-0">
            <div className="d-flex align-items-center">
              {(horizontalMenu || agencyMenu) && (
                <div className="site-logo">
                  <Link to="/" className="logo-mini">
                    <img
                      src={require("Assets/img/logo.png")}
                      className="mr-15"
                      alt="site logo"
                      width="35"
                      height="35"
                    />
                  </Link>
                  {/* <Link to="/" className="logo-normal">
									<img src={require('Assets/img/appLogoText.png')} className="img-fluid" alt="site-logo" width="67" height="17" />
								</Link> */}
                </div>
              )}
              {!agencyMenu && (
                <ul className="list-inline mb-0 navbar-left">
                  {!horizontalMenu ? (
                    <li
                      className="list-inline-item"
                      onClick={e => this.onToggleNavCollapsed(e)}
                    >
                      <Tooltip title="Sidebar Toggle" placement="bottom">
                        <IconButton
                          color="inherit"
                          mini="true"
                          aria-label="Menu"
                          className="humburger p-0"
                        >
                          <MenuIcon />
                        </IconButton>
                      </Tooltip>
                    </li>
                  ) : (
                      <li className="list-inline-item">
                        <Tooltip title="Sidebar Toggle" placement="bottom">
                          <IconButton
                            color="inherit"
                            aria-label="Menu"
                            className="humburger p-0"
                            component={Link}
                            to="/"
                          >
                            <i className="ti-layout-sidebar-left"></i>
                          </IconButton>
                        </Tooltip>
                      </li>
                    )}
                  {/* {!horizontalMenu && <QuickLinks />} */}
                  <li className="list-inline-item search-icon d-inline-block">
                    {/* <SearchForm /> */}
                    <IconButton
                      mini="true"
                      className="search-icon-btn"
                      onClick={() => this.openMobileSearchForm()}
                    >
                      <i className="zmdi zmdi-search"></i>
                    </IconButton>
                    <MobileSearchForm
                      isOpen={isMobileSearchFormVisible}
                      onClose={() =>
                        this.setState({ isMobileSearchFormVisible: false })
                      }
                    />
                  </li>
                </ul>
              )}
            </div>
            <ul className="navbar-right list-inline mb-0">
              {/* <li className="list-inline-item summary-icon">
							<Tooltip title="Summary" placement="bottom">
								<a href="#" className="header-icon tour-step-3" onClick={(e) => this.openDashboardOverlay(e)}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li> */}
              {/* {!horizontalMenu &&
							<li className="list-inline-item">
								<Tooltip title="Upgrade" placement="bottom">
									<Button component={Link} to={`/${getAppLayout(location)}/pages/pricing`} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">
										<IntlMessages id="widgets.upgrade" />
									</Button>
								</Tooltip>
							</li>
						} */}
              {/* <LanguageProvider /> */}
              {/* {this.renderMessage()} */}
              {/* <Notifications /> */}
              {/* <li className="list-inline-item setting-icon">
							<Tooltip title="Chat" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
									<i className="zmdi zmdi-comment"></i>
								</IconButton>
							</Tooltip>
						</li> */}
              <li className="list-inline-item">
                <Tooltip title="Full Screen" placement="bottom">
                  <IconButton
                    aria-label="settings"
                    onClick={() => this.toggleScreenFull()}
                  >
                    <i className="zmdi zmdi-crop-free"></i>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
            <Drawer
              anchor={"right"}
              open={this.state.customizer}
              onClose={() => this.setState({ customizer: false })}
            ></Drawer>
          </Toolbar>
        </AppBar>


      </React.Fragment>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings }) => {
  return settings;
};

export default withRouter(
  connect(mapStateToProps, {
    collapsedSidebarAction
  })(Header)
);
