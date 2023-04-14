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
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateActivity } from "../../../actions/ActivityAction";
import TextArea from "antd/lib/input/TextArea";
import BaseSelect from "Components/Elements/BaseSelect";
import moment from "moment";
import { SelectCustomer } from "../../../components/SelectCustomer";

const { TabPane } = Tabs;

class AddActivity extends Component {
  static propTypes = {
    activity: PropTypes.object,
    onSaveActivity: PropTypes.func,
    open: PropTypes.bool,
    onActivityClose: PropTypes.func
  };

  static defaultProps = {
    activity: {},
    edit: false,
    open: false
  };

  state = {
    activity: null,
    value: 1,
    filter: { paging: 0 }
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
    this.setState({
      ...this.state,
      open: !this.state.open
    });
    this.props.onActivityClose();
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var activity = {
          ...values
        };
        this.props.onSaveActivity(
          activity,
          this.props.activity ? this.props.activity.id : null
        );
      }
      this.setState({
        activity: null
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
    const {
      onActivityClose,
      open,
      edit,
      activity,
      listAccount,
      listRule
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

    const rules = listRule.map(item => {
      return {
        id: item.id,
        title: item.code
      };
    });

    const { getFieldDecorator } = this.props.form;

    const inputLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="global.edit" />
              ) : (
                  <IntlMessages id="global.create" />
                )
            }
            visible={open}
            onCancel={onActivityClose}
            closable={true}
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
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        { required: true, message: "Please input your title!" }
                      ],
                      initialValue: activity ? activity.title || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={"Khách hàng"}>
                    {getFieldDecorator("cid", {
                      rules: [
                        {
                          required: true,
                          message: "Please select your customer!"
                        }
                      ],
                      initialValue: activity ? activity.cid : ""
                    })(
                      <SelectCustomer key={"1"} />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="activity.rule_id" />}>
                    {getFieldDecorator("rule_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please input rule!"
                        }
                      ],
                      initialValue: activity ? activity.rule_id || "" : ""
                    })(
                      <BaseSelect
                        options={rules}
                        selected={activity ? activity.rule_id : ""}
                        defaultText="Select a rule"
                        showSearch={true}
                      />
                    )}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="activity.referral_id" />}>
                    {getFieldDecorator("referral_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please input referral!"
                        }
                      ],
                      initialValue: activity ? activity.referral_id : ""
                    })(
                      <SelectCustomer key={"2"} placeholder="Chọn người giới thiệu" />
                    )}
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="activity.point" />}
                        {...inputLayout}
                      >
                        {getFieldDecorator("points", {
                          rules: [
                            {
                              required: true,
                              message: "Please input your points!"
                            }
                          ],
                          initialValue: activity ? activity.points || "" : ""
                        })(<InputNumber style={{ width: "100%" }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="activity.expired" />}
                        {...inputLayout}
                      >
                        {getFieldDecorator("expired", {
                          rules: [
                            {
                              required: true,
                              message: "Please pick a date !"
                            }
                          ],
                          initialValue: activity
                            ? activity.expired
                              ? moment(activity.expired)
                              : moment()
                            : moment()
                        })(
                          <DatePicker
                            placeholder="Pick date"
                            style={{ width: "100%" }}
                            disabledDate={current => {
                              return current && current < moment()
                            }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    label={<IntlMessages id="activity.referral_data" />}
                  >
                    {getFieldDecorator("referral_data", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your referral_data!"
                        }
                      ],
                      initialValue: activity ? activity.referral_data || "" : ""
                    })(<TextArea style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: activity ? (activity.status ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.public" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="global.unpublic" />
                        </Radio>
                      </Radio.Group>
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
    listActivity: state.activity.listActivity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateActivity: data => dispatch(updateActivity(data))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "AddActivity" })(
  AddActivity
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
