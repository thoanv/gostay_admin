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
  InputNumber,
  DatePicker,
  Icon,
  Tooltip
} from "antd";
import { StarFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateInquiry } from "../../../actions/InquiryAction";
import TextArea from "antd/lib/input/TextArea";
import BaseSelect from "Components/Elements/BaseSelect";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import SunEditor, { buttonList } from "suneditor-react";

const { TabPane } = Tabs;

const formDesc = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

class AddInquiry extends Component {
  static propTypes = {
    inquiry: PropTypes.object,
    onSaveInquiry: PropTypes.func,
    open: PropTypes.bool,
    onInquiryClose: PropTypes.func
  };

  static defaultProps = {
    // inquiry: [],
    edit: false,
    open: false
  };

  state = {
    inquiry: [],
    value: 1
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.inquiry && nextProps.inquiry !== this.props.inquiry){
      this.setState({
        ...this.nextState,
        internal_notes: nextProps.inquiry.internal_notes
      })
    }
  }

  onChangeData(event) {
    var target = event.target;
    var name = target.name;
    var value = target.type === "checked" ? target.checked : target.value;
    if (name === "status") {
      value = target.value === 1 ? true : false;
    }
    this.setState({
      [name]: value
    });
  }

  onHandleClose = () => {
    this.setState({
      ...this.state,
      open: !this.state.open,
      internal_notes: ''
    });
    this.props.onInquiryClose();
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var inquiry = {
          ...values
        };
        this.props.onSaveInquiry(
          inquiry,
          this.props.inquiry ? this.props.inquiry.id : null
        );
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
      this.setState({
        inquiry: null,
        internal_notes: ''
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
    const inputCol = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      onInquiryClose,
      open,
      edit,
      inquiry,
      listAccount,
      listDestination,
      listDestinationCountry
    } = this.props;
    
    const { internal_notes } = this.state;

    const accounts = listAccount.map(item => {
      return {
        id: item.id,
        title: ((item.firstname
        ? `${item.firstname} ${item.lastname}`
        : item.email)
          ? item.firstname
            ? `${item.firstname} ${item.lastname}`
            : item.email
          : `${item.mobile}`
        ).split("null", 1)
      };
    });

    const destids = inquiry
      ? inquiry.destids
        ? inquiry.destids.map(item => +item)
        : []
      : [];

    const destinationCountry = listDestinationCountry.map(item => {
      return {
        id: item.id,
        title: item.title
      };
    });

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="inquiry.edit" />
              ) : (
                <IntlMessages id="inquiry.create" />
              )
            }
            visible={open}
            toggle={onInquiryClose}
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
              name="adminForm"
            >
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="inquiry.name" />}>
                    {getFieldDecorator("name", {
                      rules: [
                        { required: true, message: "Please input your name!" }
                      ],
                      initialValue: inquiry ? inquiry.name || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.email" />}>
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your email!"
                        }
                      ],
                      initialValue: inquiry ? inquiry.email || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.phone" />}>
                    {getFieldDecorator("phone", {
                      rules: [
                        {
                          required: true,
                          message: "Please input phone!"
                        }
                      ],
                      initialValue: inquiry ? inquiry.phone || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.content" />}>
                    {getFieldDecorator("content", {
                      initialValue: inquiry ? inquiry.content || "" : ""
                    })(<TextArea style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.cid" />}>
                    {getFieldDecorator("cid", {
                      rules: [
                        {
                          required: true,
                          message: "Please select your customer!"
                        }
                      ],
                      initialValue: inquiry ? inquiry.cid : ""
                    })(
                      <BaseSelect
                        options={accounts}
                        selected={inquiry ? inquiry.cid : ""}
                        defaultText="Select a customer"
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.depart_city" />}>
                    {getFieldDecorator("depart_city", {
                      rules: [
                        {
                          required: true,
                          message: "Please select your customer!"
                        }
                      ],
                      initialValue: inquiry ? +inquiry.depart_city : ""
                    })(
                      <BaseSelect
                        options={destinationCountry}
                        selected={inquiry ? +inquiry.depart_city : ""}
                        defaultText="Select a departure city"
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.dest_id" />}>
                    {getFieldDecorator("destids", {
                      rules: [
                        {
                          required: true,
                          message: "Please select destination!"
                        }
                      ],
                      initialValue: destids
                    })(
                      <BaseSelect mode="multiple" options={listDestination} />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="inquiry.date" />}>
                    {getFieldDecorator("date", {
                      rules: [
                        {
                          required: true,
                          message: "Please pick a date !"
                        }
                      ],
                      initialValue: inquiry
                        ? inquiry.date
                          ? moment(inquiry.date)
                          : moment()
                        : moment()
                    })(
                      <DatePicker
                        placeholder="Pick date"
                        style={{ width: "100%" }}
                        disabledDate={current => {
                          return current && current < moment().subtract(1, 'day')
                        }}
                      />
                    )}
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="global.hotel_star" />}
                        {...inputCol}
                      >
                        {getFieldDecorator("hotel_star", {
                          initialValue: inquiry ? inquiry.hotel_star : 1
                        })(<InputNumber min={1} max={5} style={{ width:"100%"}} />)}
                      </Form.Item>
                    </Col>{" "}
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="global.passenger" />}
                        {...inputCol}
                      >
                        {getFieldDecorator("passenger", {
                          initialValue: inquiry ? inquiry.passenger : 2
                        })(<InputNumber min={2} max={20} style={{width:"100%"}} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: inquiry
                        ? inquiry.status === 1
                          ? 1
                          : inquiry.status === 2
                          ? 2
                          : 3
                        : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.waiting" />
                        </Radio>
                        <Radio value={2}>
                          <IntlMessages id="global.doing" />
                        </Radio>
                        <Radio value={3}>
                          <IntlMessages id="global.done" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane
                  tab={<IntlMessages id="inquiry.internal_notes" />}
                  key="terms"
                >
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("internal_notes", {
                      rules: [
                        {
                          required: false,
                          message: "Please input your internal notes!"
                        }
                      ],
                      initialValue:
                        inquiry != null ? inquiry.internal_notes : ""
                    })(
                      <SunEditor
                        setContents={internal_notes}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
              </Tabs>
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
    listInquiry: state.inquiry.lisTinquiry
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateinquiry: data => dispatch(updateInquiry(data))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "AddInquiry" })(AddInquiry);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
