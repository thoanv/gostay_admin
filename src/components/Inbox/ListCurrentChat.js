import PropTypes from "prop-types";
import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "antd";
import {
  openInbox,
  removeCurrentInbox,
  removeCVinListInbox
} from "../../actions/InboxAction";
import { connect } from "react-redux";

class ListCurrentChat extends Component {
  setName = item => {
    let name = "";
    if (item.attend_customer) {
      let firstname = item.attend_customer.firstname || "";
      let lastname = item.attend_customer.lastname || "";
      name = firstname + " " + lastname;
    }
    if (item.firstname) {
      name = item.firstname;
    }
    if (item.lastname) {
      name = name + " " + item.lastname;
    }
    return name;
  };

  setAvt = item => {
    let avt = require('../../assets/img/user.png');
    if (item.attend_customer) {
      if (item.attend_customer.avatar) avt = item.attend_customer.avatar;
    }
    if (item.avatar) {
      avt = `${this.props.config.url_asset_root}${item.avatar}`;
    }
    return avt;
  };

  removeInbox = data => () => {
    this.props.removeCVinListInbox(data);
  };

  closeInbox = data => () => {
    if (this.props.selectedUser) {
      if (this.props.selectedUser.id == data.id)
        this.props.removeCurrentInbox(data);
      else this.props.openInbox(data);
    } else this.props.openInbox(data);
  };

  render() {
    var { listConversation, selectedUser } = this.props;

    return (
      <div className="sc-list-current-chat-inbox-custom">
        {listConversation.length
          ? listConversation.map(item => {
              let classImg = [
                "size-60 rounded-circle avt-list-current-chat-div mt-20",
                selectedUser
                  ? selectedUser.id == item.id
                    ? "rct-notify "
                    : ""
                  : ""
              ];

              return (
                <Tooltip
                  key={item.id}
                  placement="left"
                  title={this.setName(item)}
                >
                  <div className={classImg.join(" ")}>
                    <div className="ct-delete" onClick={this.removeInbox(item)}>
                      X
                    </div>
                    {item.unread ? <MessageCount></MessageCount> : null}
                    <img
                      onClick={this.closeInbox(item)}
                      className="avt-list-current-chat active-chat-avt"
                      src={this.setAvt(item)}
                      alt="avatar"
                    />
                  </div>
                </Tooltip>
              );
            })
          : null}
      </div>
    );
  }
}

ListCurrentChat.defaultProps = {
  listConversation: []
};

const MessageCount = () => {
  return (
    <div className={"sc-new-messages-count-inbox-custom rct-notify"}> </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    openInbox: data => dispatch(openInbox(data)),
    removeCurrentInbox: data => dispatch(removeCurrentInbox(data)),
    removeCVinListInbox: data => dispatch(removeCVinListInbox(data))
  };
}

function mapStateToProps(state) {
  return {
    selectedUser: state.inboxReducer.selectedUser,
    listConversation: state.inboxReducer.listConversation,
    config: state.config
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCurrentChat);
