import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { Table, Button } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {
  getConversation,
} from "../../actions/SendMessagesActions";
import { checkToken } from "../../actions/AuthActions";
import OrderDetail from "./OrderDetail";
import moment from "moment";
import { openInbox } from "../../actions/InboxAction";


class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: ""
        },
        paging: {
          perpage: 10,
          page: 1
        }
      },
      filterM: { paging: 0 },
      selectedRowKeys: [],
      open: false,
      messageList: [],
      conversation: [],
      idConversation: null,
      idCustomer: null,
      userID: "",
      authId: null,
      status: "",
      idOrderTour: null,
      unread: false
    };
  }

  componentDidMount() {
    if (this.props.auth.id !== undefined) {
      this.setState({
        authId: this.props.auth.id
      });
      this.props.getConversation(this.props.auth.id).then(res => {
        this.setState({
          conversation: res.data.list,
          count_unread: res.data.count_unread,
          unread: res.data.count_unread > 0 ? true : false
        });
      });
    } else {
      this.props.checkToken().then(res => {
        this.setState({
          authId: res.id
        });
        this.props.getConversation(res.id).then(response => {
          this.setState({
            conversation: response.data.list,
            count_unread: response.data.count_unread
            // unread: res.data.count_unread > 0 ? true : false
          });
        });
      });
    }
  }



  onShowOrderDetail = idOrderTour => {
    this.setState({
      open: true,
      idOrderTour: idOrderTour
    });
  };

  onCloseOrderDetail = () => {
    this.setState({
      open: false,
      idOrderTour: null
    });
  };

  render() {
    const {
      selectedRowKeys,
      conversation,
      messageList,
      count_unread
    } = this.state;

    const style = {
      cursor: "pointer",
      fontSize: "18px",
      marginLeft: "10px",
      color: "red"
    };

    const columnsAssignment = [
      {
        title: <IntlMessages id="global.customer" />,
        key: "customer",
        render: record => {
          return record.partner.map(item => {
            return item.partner_firstname
              ? <p>{item.partner_firstname + " " + item.partner_lastname + " "}</p>
              : "User Gopanda";
          });
        }
      },
      {
        title: <IntlMessages id="global.email" />,
        key: "email",
        render: record => {
          return record.partner.map(item => {
            return <p>{item.partner_email}</p>;
          });
        }
      },
      {
        title: <IntlMessages id="global.type" />,
        key: "type",
        render: record =>
          record.type === "order" ? (

            <Button type="link" className="p-0" onClick={() => this.onShowOrderDetail(record.entity)}>
              {record.type}
            </Button>
          ) : (
              record.type
            )
      },
      {
        title: <IntlMessages id="global.assign" />,
        key: "created_at",
        render: (text, record) => (
          <React.Fragment>
            <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
          </React.Fragment>
        )
      },
      {
        title: <IntlMessages id="global.id" />,
        key: "id",
        dataIndex: "id"
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <Button type="primary" onClick={() => this.props.openInbox(record)}>
            <IntlMessages id="global.reply" />
          </Button>
        )
      }
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.assignment" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <p style={{ fontWeight: "bold" }}>
                {count_unread > 0
                  ? "You have " + count_unread + " unread message(s)"
                  : ""}
              </p>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onSelectChange
                }}
                columns={columnsAssignment}
                dataSource={conversation}
                onChange={this.onChangTable}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </RctCollapsibleCard>
          </div>
          <OrderDetail
            open={this.state.open}
            idOrderTour={this.state.idOrderTour}
            onCloseOrderDetail={this.onCloseOrderDetail}
          />
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    lisConversation: state.send_messages.lisConversation,
    auth: state.authUser.data,
    paging: state.send_messages.paging
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getConversation: id => dispatch(getConversation(id)),
    checkToken: data => dispatch(checkToken(data)),
    openInbox: data => dispatch(openInbox(data)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Assignment)
);
