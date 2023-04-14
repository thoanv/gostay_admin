/**
 * User List
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';

// app layouts
import { getAppLayout } from 'Helpers/helpers';

// components
import RecentChatUsers from './RecentChatUsers';
import { Icon } from 'antd';

// redux actions
import {
    chatWithSelectedUser,
} from 'Actions';

class UserList extends Component {



    /**
     * Swicth Chat With User
     * @param {*object} user
     */
    switchChatWithUser(user) {
        this.props.chatWithSelectedUser(user);
    }



    onScrollSidebar = (e) => {
            let tMax = this.refs.chatScrollSidebar.getScrollHeight() - this.refs.chatScrollSidebar.getClientHeight();
            let t = this.refs.chatScrollSidebar.getScrollTop()
            if (t + 100 > tMax) {
                this.props.onChangePage()
            }
    }

    render() {
        var { data } = this.props;
        return (
            <div className="chat-list">
                <Scrollbars
                    className="rct-scroll"
                    autoHide
                    style={{ height: 'calc(100vh - 188px)' }}
                    onScroll={this.onScrollSidebar}
                    ref="chatScrollSidebar"
                >
                    <RecentChatUsers data={data.list} config={this.props.config}/>
                    {this.props.loadingPage ?
                        <div align="center"><Icon type="loading" /></div>
                        :
                        null}
                </Scrollbars>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        chatWithSelectedUser: (user) => dispatch(chatWithSelectedUser(user))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(UserList));
