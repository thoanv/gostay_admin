/**
 * Nav Menu Item
 */
import React, { Fragment, Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import { connect } from 'react-redux';

function checkPermission(permissionArr, menu) {
   if (!menu.resource) return true;
   for (let i = 0; i < permissionArr.length; i++) {
      if (permissionArr[i] && permissionArr[i]._id && menu && (permissionArr[i]._id.toString() === menu.resource.toString())) return true;
   }
   return false;
}

function checkPermissionChild(permissionArr, menu) {
   let lg = 0;
   if (menu.child_routes && menu.child_routes.length) {
      for (let i = 0; i < menu.child_routes.length; i++) {
         if (checkPermission(permissionArr, menu.child_routes[i])) lg++;
      }
   }
   return lg;
}

class NavMenuItem extends Component {

   state = {
      subMenuOpen: ''
   }
	/**
   * On Toggle Collapse Menu
   */
   onToggleCollapseMenu(index) {
      if (this.state.subMenuOpen === '') {
         this.setState({
            subMenuOpen: index
         })
      }
      else if (this.state.subMenuOpen !== index) {
         this.setState({
            subMenuOpen: index
         })
      }
      else {
         this.setState({ subMenuOpen: '' });
      }
   }

   render() {
      const { menu, onToggleMenu } = this.props;
      const { subMenuOpen } = this.state;
      var { permission } = this.props;

      if (permission && permission.length) {
         if (menu.child_routes != null) {
            if (checkPermissionChild(permission, menu))
               return (
                  <Fragment>
                     <ListItem button component="li" onClick={onToggleMenu} className={`list-item ${classNames({ 'item-active': menu.open })}`}>
                        <ListItemIcon className="menu-icon">
                           <i className={menu.menu_icon}></i>
                        </ListItemIcon>
                        <span className="menu">
                           <IntlMessages id={menu.menu_title} />

                        </span>
                        {menu.new_item && menu.new_item === true ?
                           <Chip label="new" className="new-item" color="secondary" />
                           :
                           ''
                        }
                     </ListItem>
                     <Collapse in={menu.open} timeout="auto" className="sub-menu">
                        <Fragment>
                           {menu.type_multi == null ?
                              <List className="list-unstyled py-0">
                                 {menu.child_routes.map((subMenu, index) => {
                                    if (checkPermission(permission, subMenu))
                                       return (
                                          <ListItem button component="li" key={index}>
                                             <NavLink to={subMenu.path} activeClassName="item-active" >
                                                <span className="menu">
                                                   <IntlMessages id={subMenu.menu_title} />

                                                </span>
                                                {subMenu.new_item && subMenu.new_item === true ?
                                                   <Chip label="new" className="new-item" color="secondary" />
                                                   :
                                                   ''
                                                }
                                             </NavLink>
                                          </ListItem>
                                       )
                                    return null;
                                 })}
                              </List>
                              :
                              <List className="list-unstyled py-0">
                                 {menu.child_routes.map((subMenu, index) => {
                                    if (checkPermission(permission, subMenu))
                                       return (
                                          <Fragment key={index}>
                                             <ListItem button component="li"
                                                onClick={() => this.onToggleCollapseMenu(index)}
                                                className={`list-item ${classNames({ 'item-active': subMenuOpen === index })}`}
                                             >
                                                <span className="menu">
                                                   <IntlMessages id={subMenu.menu_title} />
                                                   {menu.new_item && menu.new_item === true ?
                                                      <Chip label="new" className="new-item" color="secondary" />
                                                      :
                                                      null
                                                   }
                                                </span>
                                             </ListItem>
                                             <Collapse in={subMenuOpen === index} timeout="auto">
                                                <List className="list-unstyled py-0">
                                                   {subMenu.child_routes.map((nestedMenu, nestedKey) => (
                                                      <ListItem button component="li" key={nestedKey}>
                                                         <NavLink activeClassName="item-active" to={nestedMenu.path}>
                                                            <span className="menu pl-10 d-inline-block">
                                                               <IntlMessages id={nestedMenu.menu_title} />
                                                               {menu.new_item && menu.new_item === true ?
                                                                  <Chip label="new" className="new-item" color="secondary" />
                                                                  :
                                                                  null
                                                               }
                                                            </span>
                                                         </NavLink>
                                                      </ListItem>
                                                   ))}
                                                </List>
                                             </Collapse>
                                          </Fragment>
                                       )
                                    return null;
                                 })}
                              </List>
                           }
                        </Fragment>
                     </Collapse>
                  </Fragment>
               )
            return null;
         }
         if (checkPermission(permission, menu))
            return (
               <ListItem button component="li">
                  <NavLink activeClassName="item-active" to={menu.path}>
                     <ListItemIcon className="menu-icon">
                        <i className={menu.menu_icon}></i>
                     </ListItemIcon>
                     <span className="menu">
                        <IntlMessages id={menu.menu_title} />
                     </span>
                  </NavLink>
               </ListItem>
            );
         return null;
      }
      return null;
   }

}

// map state to props
const mapStateToProps = ({ sidebar, authUser }) => {
   const { permission } = authUser;
   return { sidebar, permission };
};

export default connect(mapStateToProps, null)(NavMenuItem);
