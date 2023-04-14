import React from "react";
import { connect } from "react-redux";
import { Tag, Button, Avatar, Tooltip } from "antd";
import Widget from "../../Widget";
import "../../../../public/style.css";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import { checkToken } from "../../../actions/AuthActions";
import {
  getListNewMessage,
} from "../../../actions/SendMessagesActions";
import config from "../../../../config";
import { openInbox } from '../../../actions/InboxAction';
import { convertTimezone } from "../../../helpers/helpers";
import moment from "moment";

class TaskList extends React.Component {


  componentDidMount() {
    this.props.getListNewMessage()
  }

  getMessages(data) {
    this.props.openInbox(data);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messageReceived != this.props.messageReceived && this.props.messageReceived) {
      this.props.getListNewMessage()
    }
  }


  setDate(data) {

    let v = data ? data : "";
    if (v) {
      var m = moment.utc(v); // parse input as UTC
      if (m.clone().local().format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")) {
        return m.clone().local().fromNow();
      }
      else return m.clone().local().format("ddd, MMM DD, YYYY, HH:mm")

    }
    return "";

  }

  render() {

    var { config } = this.props;
    var listNewMessage = this.props.listMessages ? this.props.listMessages : []
    return (
      <Widget
        title={
          <h2 className="h4 gx-text-capitalize gx-mb-0">All New Customer Messages</h2>
        }
        styleName="gx-card-ticketlist"
        extra={
          <h5 className="gx-text-primary gx-mb-0 gx-pointer gx-d-none gx-d-sm-block">
            <Link to="/app/conversation">
              <IntlMessages id="global.seeallconversation" />
              <i className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle" />
            </Link>
          </h5>
        }
      >
        {listNewMessage.map(item => {
          // let customer = item.firstname + " " + item.lastname;
          let tag = item.type;

          let time = convertTimezone(item.updated_at, "LLLL");
          const description = [
            <React.Fragment key={item.id} >
              <span className="gx-link" style={{ marginRight: "10px" }}>

                <Link to={`/app/customer/${item.cid}`} style={{ color: "blue" }}>
                  {item.firstname + " " + item.lastname}
                </Link>
              </span>
              <span

                color={tag === "order" ? "red" : "green"}
                style={{ margin: "0", marginRight: "10px", color: tag === "order" ? "red" : "green" }}
              >
                {tag}
              </span>
              <span >{tag === "order" ? item.tour_title : ""}</span>
            </React.Fragment>
          ];
          return (
            <div
              key={item.id}
              className="gx-media gx-task-list-item gx-flex-nowrap"
            >
              <Avatar
                className="gx-mr-3 gx-size-36"
                src={
                  item.avatar
                    ? config.url_asset_root + item.avatar
                    : require('../../../assets/img/user.png')
                }
              />
              <div className="gx-media-body gx-task-item-content">
                <div className="gx-task-item-content-left">
                  <h5 className="gx-text-truncate gx-task-item-title">
                    {description}
                  </h5>
                  <p className="gx-text-grey gx-fs-sm gx-mb-0">
                    {item.newMessage ? item.newMessage[0] ? item.newMessage[0].content : "" : ""}
                    {" - "}
                    <span>{this.setDate(item.updated_at)}</span>
                    {
                      item.attend_admin && item.attend_admin.length ?
                        <React.Fragment>
                          {" - "}
                          <span style={{ color: "blue" }}>
                            <Tooltip
                              key={item.id}
                              placement="top"
                              title={item.attend_admin.map(e => {
                                return (
                                  <p key={e.id}>{e.partner_firstname + " " + e.lastname}</p>
                                );
                              })}
                            >
                              Support name{""}
                            </Tooltip>
                          </span>
                        </React.Fragment>
                        :
                        ""
                    }
                    {/* { " - "} */}
                    {/* <span span style={{ color: "blue" }}>
                      <Tooltip
                      placement="top"
                      title={item.attend_admin.map(e => {
                        return (
                          <p>{e.partner_firstname + " " + e.lastname}</p>
                        );
                      })}
                    >
                      Support name{""}
                    </Tooltip>
                    </span> */}

                  </p>
                </div>
                <div className="gx-task-item-content-right">
                  <Button type="primary" onClick={() => {
                    this.getMessages(item);
                  }}>
                    <IntlMessages id="global.reply" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })
        }
      </Widget >
    );
  }
}

const mapStateToProps = state => {
  return {
    listMessages: state.send_messages.newMessage,
    auth: state.authUser.data,
    messageReceived: state.send_messages.messageReceived,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkToken: () => dispatch(checkToken()),
    getListNewMessage: () => dispatch(getListNewMessage()),
    openInbox: data => dispatch(openInbox(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TaskList)
);
