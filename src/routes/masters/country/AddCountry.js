import { Button, Col, Form, Input, Modal, Radio, Row, Tabs } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import SunEditor, { buttonList } from "suneditor-react";

class AddCountry extends Component {
  static propTypes = {
    country: PropTypes.object,
    onSaveCountry: PropTypes.func,
    open: PropTypes.bool,
    onCountryClose: PropTypes.func,
    edit: PropTypes.bool
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var country = { ...values };
        this.props.onSaveCountry(
          country,
          this.props.country ? this.props.country.id : null
        )
      }
    });
  };
  render() {
    const { country, open, onCountryClose, edit } = this.props;

    const { getFieldDecorator } = this.props.form;
    const { TabPane } = Tabs;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemLayoutContent = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    };

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="country.editCountry" />
              ) : (
                <IntlMessages id="country.addCountry" />
              )
            }
            toggle={onCountryClose}
            visible={open}
            closable={true}
            destroyOnClose={true}
            onCancel={onCountryClose}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your name country !"
                        }
                      ],
                      initialValue: country ? country.title || "" : ""
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
                      initialValue: country ? country.code || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="country.phone_code" />}>
                    {getFieldDecorator("phone_code", {
                      rules: [
                        {
                          required: true,
                          message: "Please input phone_code!"
                        }
                      ],
                      initialValue: country ? country.phone_code || "" : ""
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: country ? (country.status ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.active" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="global.deactivate" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="country.content" />} key="2">
                  <Form.Item {...formItemLayoutContent}>
                    {getFieldDecorator("content", {
                      rules: [
                        {
                          required: false,
                          message: "Please input content!"
                        }
                      ],
                      initialValue: country ? country.content || "" : ""
                    })(
                      <SunEditor
                        setContents={country ? country.content || "" : ""}
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
                    onClick={() => this.props.onCountryClose()}
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

export default Form.create({ name: "country" })(AddCountry);
