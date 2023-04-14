/**
 * Sidebar Content
 */
import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// items
import NavMenuItem from "./NavMenuItem";

// redux actions
import { onToggleMenu } from "Actions";


class SidebarContent extends Component {
    toggleMenu(menu, stateCategory) {
        let data = {
            menu,
            stateCategory,
        };
        this.props.onToggleMenu(data);
    }

    render() {
        const { sidebarMenus } = this.props.sidebar;
        return (
            <div className="rct-sidebar-nav">
                <nav className="navigation">
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.dashboard.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "dashboard")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.earning.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "earning")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.statistic.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "statistic")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.orders.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "orders")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.manageHotel.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "manage_hotel")}
                                />
                            )

                        })}
                    </List>

                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.tours.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "tours")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.combo.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "combo")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.manageEvent.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "manage_event")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.manageVoucher.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "manage_voucher")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.holiday.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "holiday")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.accounts.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "accounts")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.otherManager.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "otherManager")}
                                />
                            )

                        })}
                    </List>

                    {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.restaurent.map((menu, key) => (
                            <NavMenuItem
                                menu={menu}
                                key={key}
                                onToggleMenu={() => this.toggleMenu(menu, "restaurent")}
                            />
                        ))}
                    </List> */}


                    {/*<List className="rct-mainMenu p-0 m-0 list-unstyled">*/}
                    {/*    {sidebarMenus.manageSlider.map((menu, key) => {*/}
                    {/*        return (*/}
                    {/*            <NavMenuItem*/}
                    {/*                menu={menu}*/}
                    {/*                key={key}*/}
                    {/*                onToggleMenu={() => this.toggleMenu(menu, "manage_slider")}*/}
                    {/*            />*/}
                    {/*        )*/}

                    {/*    })}*/}
                    {/*</List>*/}
                    {/*<List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.manageBrand.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "manage_brand")}
                                />
                            )

                        })}
                    </List>*/}
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.reviews.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "files")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.messages.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "messages")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.promotion.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "promotion")}
                                />
                            )

                        })}
                    </List>

                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.loyalty.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "loyalty")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.newsletter.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "newsletter")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.wishlist.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "wishlist")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.widgets.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "widgets")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.masters.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "masters")}
                                />
                            )

                        })}
                    </List>
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.settings.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "settings")}
                                />
                            )

                        })}
                    </List>
                    {/*<List className="rct-mainMenu p-0 m-0 list-unstyled">*/}
                    {/*    {sidebarMenus.stay.map((menu, key) => {*/}
                    {/*        return (*/}
                    {/*            <NavMenuItem*/}
                    {/*                menu={menu}*/}
                    {/*                key={key}*/}
                    {/*                onToggleMenu={() => this.toggleMenu(menu, "stay")}*/}
                    {/*            />*/}
                    {/*        )*/}

                    {/*    })}*/}
                    {/*</List>*/}
                    {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.flights.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "flights")}
                                />
                            )

                        })}
                    </List> */}
                    <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.transports.map((menu, key) => {
                            return (
                                <NavMenuItem
                                    menu={menu}
                                    key={key}
                                    onToggleMenu={() => this.toggleMenu(menu, "transports")}
                                />
                            )

                        })}
                    </List>


                    {/*<List className="rct-mainMenu p-0 m-0 list-unstyled">*/}
                    {/*    {sidebarMenus.files.map((menu, key) => {*/}
                    {/*        return (*/}
                    {/*            <NavMenuItem*/}
                    {/*                menu={menu}*/}
                    {/*                key={key}*/}
                    {/*                onToggleMenu={() => this.toggleMenu(menu, "files")}*/}
                    {/*            />*/}
                    {/*        )*/}

                    {/*    })}*/}
                    {/*</List>*/}

                    {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.growthHacking.map((menu, key) => (
                            <NavMenuItem
                                menu={menu}
                                key={key}
                                onToggleMenu={() => this.toggleMenu(menu, "growthHacking")}
                            />
                        ))}
                    </List> */}


                    {/*<List className="rct-mainMenu p-0 m-0 list-unstyled">*/}
                    {/*    {sidebarMenus.chat.map((menu, key) => {*/}
                    {/*        return (*/}
                    {/*            <NavMenuItem*/}
                    {/*                menu={menu}*/}
                    {/*                key={key}*/}
                    {/*                onToggleMenu={() => this.toggleMenu(menu, "chat")}*/}
                    {/*            />*/}
                    {/*        )*/}

                    {/*    })}*/}
                    {/*</List>*/}
                    {/* <List className="rct-mainMenu p-0 m-0 list-unstyled">
                        {sidebarMenus.pages.map((menu, key) => (
                            <NavMenuItem
                                menu={menu}
                                key={key}
                                onToggleMenu={() => this.toggleMenu(menu, "pages")}
                            />
                        ))}
                    </List> */}


                </nav>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ sidebar, authUser }) => {
    const { permission } = authUser;
    return { sidebar, permission };
};

export default withRouter(connect(mapStateToProps, { onToggleMenu })(SidebarContent));
