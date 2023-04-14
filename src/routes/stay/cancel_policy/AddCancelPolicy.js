import { Button, Col, Form, Input, Modal, Radio, Row, InputNumber } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {connect} from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../../fileManager/InputChosseFile";
import ReactQuill from 'react-quill';
// actions
import { getConfig } from '../../../actions/ConfigActions';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const inputCol = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class AddCancelPolicy extends Component {
  formRef = React.createRef();
  static propTypes = {
    open: PropTypes.bool,
    onCloseÍnurrance: PropTypes.func,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  state = {};

  onHandleClose = () => {
    this.props.onItemClose();
  };

  onFinish = (e) => {
    e.preventDefault();
    this.props.form
      .validateFields(async (err, values) => {
        if (!err) {
          var value = { ...values };

          await this.props.onSaveItem(
            value,
            this.props.item ? this.props.item.id : null
          );
          this.props.getConfig();
        }
      })

  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { open, edit, item } = this.props;

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="global.edit" />
              ) : (
                <IntlMessages id="global.add_new" />
              )
            }
            visible={open}
            closable={true}
            onCancel={this.onHandleClose}
            footer={null}
            width="60%"
          >
            <Form layout="vertical" onSubmit={this.onFinish}>
              <Form.Item label={<IntlMessages id="global.title" />}>
                {getFieldDecorator("title", {
                  rules: [{ required: true, message: <IntlMessages id="global.required" /> }],
                  initialValue: item ? item.title || "" : "",
                })(<Input />)}
              </Form.Item>
              <Row gutter={16} type="flex">
                <Col span={12}>
                  <Form.Item label={<IntlMessages id="cancel.cancel_day" />}>
                    {getFieldDecorator("cancel_day", {
                      rules: [{ required: true, message: <IntlMessages id="global.required" /> }],
                      initialValue: item ? item.cancel_day || 1 : 1,
                    })(<InputNumber min={0} style={{ width: "100%" }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<IntlMessages id="global.percentage" />}>
                    {getFieldDecorator("percentage", {
                      rules: [{ required: true, message: <IntlMessages id="global.required" /> }],
                      initialValue: item ? item.percentage || 0 : 0,
                    })(
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label={<IntlMessages id="global.content" />}>
                {getFieldDecorator("content", {
                  rules: [{ required: true, message: <IntlMessages id="global.required" /> }],
                  initialValue: item ? item.content || "" : "",
                })(<ReactQuill />)}
              </Form.Item>

              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="default" onClick={() => this.onHandleClose()}>
                    <IntlMessages id="global.cancel" />
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    htmlType="submit"
                    loading={this.props.loading}
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

function mapDispatchToProps(dispatch) {
  return {
    getConfig: () => dispatch(getConfig())
  }
}

export default connect(null, mapDispatchToProps)(Form.create({ name: "amenity" })(AddCancelPolicy));
// Form.create({ name: "amenity" })(AddCancelPolicy)