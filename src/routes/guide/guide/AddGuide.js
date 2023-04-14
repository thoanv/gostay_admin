import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getAllGroups } from "../../../actions/GroupActions";
import InputChosseFile from "../../fileManager/InputChosseFile";
import { NotificationManager } from "react-notifications";
import { _getAll } from "../../../actions/PermissionAction";

class AddGuide extends Component {
  static propTypes = {
    account: PropTypes.object,
    onSaveAccount: PropTypes.func,
    open: PropTypes.bool,
    onAccountClose: PropTypes.func
  };

  static defaultProps = {
    account: {
      roleid: []
    },
    edit: false,
    open: false
  };

  state = {
    roleid: [],
    account: null
  };

  // async componentDidMount() {
  //   await this.props.getListGroup();
  //   let guide = this.props.listGroup.filter(item => item.slug === "guide");
  //   this.setState({
  //     ...this.state,
  //     groupid: this.props.edit
  //       ? this.props.account.groupid
  //       : guide.map(item => item.id),
  //     account: this.props.account
  //   });
  // }

  componentDidMount() {
    this.props._getAll();
    this.setState({
      ...this.state,
      account: this.props.account
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.account !== state.account) {
      return {
        ...state,
        account: props.account
      };
    }
    return null;
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.account !== state.account) {
  //     let guide = props.listGroup.filter(item => item.slug === "guide");
  //     return {
  //       ...state,
  //       groupid: props.edit
  //         ? props.account.groups.map(item => item.id)
  //         : guide.length
  //         ? guide.map(item => item.id)
  //         : [null],
  //       account: props.account
  //     };
  //   }
  //   return null;
  // }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var account = {
          ...values,
        
        };
        this.props.onSaveAccount(
          account,
          this.props.account ? this.props.account.id : null
        );
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
    });
  };

  render() {
    const { onAccountClose, open, account, edit } = this.props;
    const { getFieldDecorator } = this.props.form;
    const dedfaultImage = account
      ? account.image
        ? [{ name: account.image, path_relative: account.image }]
        : []
      : [];
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
    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="account.saveGuide" />
              ) : (
                <IntlMessages id="account.addGuide" />
              )
            }
            toggle={onAccountClose}
            visible={open}
            closable={true}
            onCancel={() => this.props.onAccountClose()}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label={<IntlMessages id="global.firstname" />}>
                {getFieldDecorator("firstname", {
                  rules: [
                    { required: true, message: "Please input your firstname!" }
                  ],
                  initialValue: account ? account.firstname || "" : ""
                })(<Input style={{ width: "100%" }} />)}
              </Form.Item>

              <Form.Item label={<IntlMessages id="global.lastname" />}>
                {getFieldDecorator("lastname", {
                  rules: [
                    { required: true, message: "Please input your last name !" }
                  ],
                  initialValue: account ? account.lastname || "" : ""
                })(<Input style={{ width: "100%" }} />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="guide.nickname" />}>
                {getFieldDecorator("nick_name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input guide's nickname !"
                    }
                  ],
                  initialValue: account ? account.nick_name || "" : ""
                })(<Input style={{ width: "100%" }} />)}
              </Form.Item>
              {edit ? null : (
                <Form.Item
                  label={<IntlMessages id="global.password" />}
                  hasFeedback
                >
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your password!"
                      },
                      {
                        validator: this.validateToNextPassword
                      }
                    ],
                    initialValue: account ? account.password || "" : ""
                  })(<Input.Password />)}
                </Form.Item>
              )}
              <Form.Item label={<IntlMessages id="global.email" />}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!"
                    }
                  ],
                  initialValue: account ? account.email || "" : ""
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="global.mobile" />}>
                {getFieldDecorator("mobile", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your phone number!"
                    }
                  ],
                  initialValue: account ? account.mobile || "" : ""
                })(<InputNumber style={{ width: "100%" }} />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="global.avatar" />}>
                <InputChosseFile
                  onChange={this.getValueChosseFile}
                  limit={1}
                  defautValue={dedfaultImage}
                ></InputChosseFile>
              </Form.Item>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.props.onAccountClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    htmlType="submit"
                    loading={this.props.loading}
                  >
                    Submit
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
const mapStateToProps = state => {
  return {
    list: state.permission.list_role,
  };
};
function mapDispatchToProps(dispatch) {
  return {
    _getAll: () => dispatch(_getAll()),
   
  };
}

export default Form.create({ name: "guide" })(
  connect(mapStateToProps, mapDispatchToProps)(AddGuide)
);
