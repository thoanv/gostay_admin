import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Tabs,
  InputNumber
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
import SunEditor, { buttonList } from "suneditor-react";


class AddRules extends Component {
  static propTypes = {
    rule: PropTypes.object,
    onSaveRules: PropTypes.func,
    open: PropTypes.bool,
    onRulesClose: PropTypes.func,
    edit: PropTypes.bool
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var rule = { ...values };
        console.log(values);

        this.props.onSaveRules(
          rule,
          this.props.rule ? this.props.rule.id : null
        );
      }
    });
  };
  render() {
    const { rule, open, onRulesClose, edit, expired_date } = this.props;

    const { getFieldDecorator } = this.props.form;
    const { TabPane } = Tabs;
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
    const formItemLayoutContent = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    };

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
            onCancel={onRulesClose}
            visible={open}
            closable={true}
            footer={null}
            width="60%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.name" />}>
                    {getFieldDecorator("rule_name", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your name rule !"
                        }
                      ],
                      initialValue: rule ? rule.rule_name || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your title !"
                        }
                      ],
                      initialValue: rule ? rule.title || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.code" />}>
                    {getFieldDecorator("code", {
                      rules: [
                        {
                          required: true,
                          message: "Please input code!"
                        }
                      ],
                      initialValue: rule ? rule.code || "" : ""
                    })(<Input disabled />)}
                  </Form.Item>
                    {/* <Col span={12}>
                      <Form.Item label={<IntlMessages id="global.Percentage" />} {...inputLayout}>
                        {getFieldDecorator("percentage", {
                          rules: [
                            {
                              required: true,
                              message: "Please input percentage!"
                            }
                          ],
                          initialValue: rule ? rule.percentage || "" : ""
                        })(<InputNumber style={{ width: "100%" }} />)}
                      </Form.Item>
                    </Col> */}
                    {/* <Col span={12}> */}
                      <Form.Item label={<IntlMessages id="global.point" />}>
                        {getFieldDecorator("points", {
                          rules: [
                            {
                              required: true,
                              message: "Please input points!"
                            }
                          ],
                          initialValue: rule ? rule.points || "" : ""
                        })(<InputNumber style={{ width: "100%" }} />)}
                      </Form.Item>
                    {/* </Col> */}
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: rule ? (rule.status ? 1 : 0) : 1
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
                  {/* <Col span={12}>
                      <Form.Item label="Expired" {...inputLayout}>
                        {getFieldDecorator("expired", {
                          rules: [
                            {
                              required: true,
                              message: "Please input expired!"
                            }
                          ],
                          initialValue: rule
                            ? moment(rule.expired) || ""
                            : moment()
                        })(<DatePicker
                            disabledDate={current => {
                              return current && current < moment().subtract(1, 'day')
                            }}
                        />)}
                      </Form.Item>
                    </Col> */}
                    {/* <Col span={12}> */}
                      <Form.Item label="Expired day">
                        {getFieldDecorator("expired_day", {
                          rules: [
                            {
                              required: true,
                              message: "Please input expired day!"
                            }
                          ],
                          initialValue: rule ? rule.expired_day : 60
                        })(
                          <BaseSelect
                            showSearch
                            options={expired_date}
                            optionValue="id"
                          />
                        )}
                      </Form.Item>
                    {/* </Col> */}
                  {/* <Form.Item label={<IntlMessages id="global.autoapproved" />}>
                    {getFieldDecorator("autoapproved", {
                      initialValue: rule ? (rule.autoapproved ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.yes" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="global.no" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item> */}
                </TabPane>
                <TabPane tab={<IntlMessages id="global.desc" />} key="2">
                  <Form.Item {...formItemLayoutContent}>
                    {getFieldDecorator("rule_description", {
                      rules: [
                        {
                          required: true,
                          message: "Please input rule_description!"
                        }
                      ],
                      initialValue: rule ? rule.rule_description || "" : ""
                    })(
                      <SunEditor
                        setContents={rule ? rule.rule_description : ''}
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
                    type="default"
                    onClick={() => this.props.onRulesClose()}
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

export default Form.create({ name: "rule" })(AddRules);
