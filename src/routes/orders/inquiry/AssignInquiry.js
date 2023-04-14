import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Row, Col, Modal, Button } from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import { assign } from "../../../actions/AssignAction";
import { getAllInquiry } from "../../../actions/InquiryAction";
import BaseSelect from "Components/Elements/BaseSelect";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";

class AssignInquiry extends Component {
  static propTypes = {
    inquiry: PropTypes.object,
    onSaveInquiry: PropTypes.func,
    open: PropTypes.bool,
    onInquiryClose: PropTypes.func
  };

  static defaultProps = {};

  state = {
    filter: {
      paging: 0
    },
    current_assign: null
  };

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (
      nextProps.current_assign &&
      nextProps.current_assign !== this.props.current_assign
    ) {
      this.props.getAllACCOUNT(this.state.filter, "admin");
      this.setState({
        ...this.nextState,
        current_assign: nextProps.current_assign
      });
    }
  }

  onHandleClose = () => {
    this.props.onCloseAssign();
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);

      if (!err) {
        var assign = {
          ...values,
          object_id: this.state.current_assign.id,
          type: "inquiry",
          cid: this.state.current_assign.cid
        };
        this.props.assign(assign);
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
      this.setState(
        {
          current_assign: null
        },
        () => {
          this.props.onCloseAssign();
          this.props.history.push("/app/assignment");
        }
      );
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const {
      onCloseAssign,
      openAssign,
      current_assign,
      listAccount
    } = this.props;

    const accounts = listAccount.map(item => {
      return {
        id: item.id,
        title: (item.email
          ? `${item.email} - ${item.firstname} ${item.lastname}`
          : `${item.mobile}`
        )
          .split("null", 1)
          .toString()
      };
    });

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        {openAssign ? (
          <Modal
            title={<IntlMessages id="global.assign" />}
            visible={openAssign}
            toggle={onCloseAssign}
            closable={true}
            onCancel={this.onHandleClose}
            footer={null}
            width="50%"
          >
            <Form
              onSubmit={this.Update}
              {...formItemLayout}
              style={{ width: "100%" }}
              name="adminForm"
            >
              <Form.Item label={<IntlMessages id="inquiry.name" />}>
                {getFieldDecorator("assign_id", {
                  rules: [{ required: true, message: "Please input admin!" }],
                  initialValue: current_assign
                    ? current_assign.assign_id || ""
                    : ""
                })(
                  <BaseSelect
                    options={accounts}
                    selected={current_assign ? current_assign.assign_id : ""}
                    defaultText="Select a admin"
                    showSearch={true}
                  />
                )}
              </Form.Item>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.onHandleClose()}
                  >
                    <IntlMessages id="global.cancel" />
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    htmlType="submit"
                  >
                    <IntlMessages id="global.submit" />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listAccount: state.account.listAccount
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllACCOUNT: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllInquiry: () => dispatch(getAllInquiry()),
    assign: data => dispatch(assign(data))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "AssignInquiry" })(
  AssignInquiry
);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm)
);
