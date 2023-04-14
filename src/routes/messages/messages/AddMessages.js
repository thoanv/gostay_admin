import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Row,
  Col,
  Modal,
  Radio,
  Button,
  Tabs,
  DatePicker,
  TimePicker
} from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateMessages } from "../../../actions/MessagesAction";
import moment from "moment";
import BaseSelect from "Components/Elements/BaseSelect";


class AddMessages extends Component {
  static propTypes = {
    messages: PropTypes.object,
    onSaveMessages: PropTypes.func,
    open: PropTypes.bool,
    onMessagesClose: PropTypes.func
  };

  static defaultProps = {
    messages: {},
    edit: false,
    open: false
  };

  state = {
    messages: null,
    value: 1,
    isOpenSchedule: false,
    isOpenCustom: false
  };

  onShowSchedule = () => {
    this.setState({
      isOpenSchedule: true
    });
  };

  onHideSchedule = () => {
    this.setState({
      isOpenSchedule: false
    });
  };

  onShowCustom = () => {
    this.setState({
      isOpenCustom: true
    });
  };

  onHideCustom = () => {
    this.setState({
      isOpenCustom: false
    });
  };

  onChangeData(event) {
    var target = event.target;
    var name = target.name;
    var value = target.type === "checked" ? target.checked : target.value;
    if (name === "status") {
      value = target.value === 1 ? true : false;
      console.log("value", value);
    }
    this.setState({
      [name]: value
    });
  }

  onHandleClose = () => {
    this.props.onMessagesClose();
    this.setState({
      ...this.state,
      open: !this.state.open,
      isOpenSchedule: false,
      isOpenCustom: false
    });
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var messages = {
          ...values
        };
        this.props.onSaveMessages(
          messages,
          this.props.messages ? this.props.messages.id : null
        );
      }
      this.setState({
        messages: null
      });
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

    const formDateLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const { onMessagesClose, open, edit, messages, customer } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="messages.edit" />
              ) : (
                <IntlMessages id="messages.create" />
              )
            }
            visible={open}
            toggle={onMessagesClose}
            closable={true}
            destroyOnClose={true}
            onCancel={this.onHandleClose}
            footer={null}
            width="50%"
          >
            <Form
              onSubmit={this.Update}
              {...formItemLayout}
              style={{ width: "100%" }}
            >
              <Form.Item label={<IntlMessages id="global.title" />}>
                {getFieldDecorator("title", {
                  rules: [
                    { required: true, message: "Please input your title!" }
                  ],
                  initialValue: messages ? messages.title || "" : ""
                })(<Input style={{ width: "100%" }} />)}
              </Form.Item>

              <Form.Item label={<IntlMessages id="messages.content" />}>
                {getFieldDecorator("content", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your content!"
                    }
                  ],
                  initialValue: messages ? messages.content || "" : ""
                })(<Input style={{ width: "100%" }} />)}
              </Form.Item>
              {/* <Form.Item label={<IntlMessages id="messages.customer" />}>
                <Radio.Group name="radiogroup">
                  <Radio value={0} onClick={() => this.onHideCustom()}>
                    <IntlMessages id="messages.all" />
                  </Radio>
                  <Radio value={1} onClick={() => this.onHideCustom()}>
                    <IntlMessages id="messages.ios" />
                  </Radio>
                  <Radio value={2} onClick={() => this.onHideCustom()}>
                    <IntlMessages id="messages.android" />
                  </Radio>
                  <Radio value={3} onClick={() => this.onShowCustom()}>
                    <IntlMessages id="messages.custom" />
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label={<IntlMessages id="messages.calendar" />}>
                <Radio.Group name="radiogroup">
                  <Radio value={1} onClick={() => this.onHideSchedule()}>
                    <IntlMessages id="messages.now" />
                  </Radio>
                  <Radio value={0} onClick={() => this.onShowSchedule()}>
                    <IntlMessages id="messages.schedule" />
                  </Radio>
                </Radio.Group>
              </Form.Item> */}
              {/* {isOpenSchedule ? (
                <Row>
                  <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="messages.time" />}
                        {...formDateLayout}
                      >
                        <TimePicker
                          placeholder="Pick time"
                          disabledHours={current => {
                            return current && current < moment()
                          }}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<IntlMessages id="messages.date" />}
                      {...formDateLayout}
                    >
                      <DatePicker
                        placeholder="Pick date"
                        disabledDate={current => {
                          return current && current < moment()
                        }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                ""
              )}
               */}
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
                    loading={this.props.loading}
                  >
                    {/* <IntlMessages id="global.submit" /> */}
                    Lưu
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
    listMessages: state.messages.listMessages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMessages: data => dispatch(updateMessages(data))
  };
};

const WrappedNormalLoginForm = Form.create({ name: "AddMessages" })(
  AddMessages
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
