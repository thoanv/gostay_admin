import { Button, Col, Form, Input, Modal, Radio, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";

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

const inputLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class AddRoom extends Component {
  formRef = React.createRef();
  static propTypes = {
    open: PropTypes.bool,
    onCloseÍnurrance: PropTypes.func,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  onHandleClose = () => {
    this.props.onItemClose();
  };

  onFinish = (e) => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var value = { ...values };
          this.props.onSaveItem(
            value,
            this.props.item ? this.props.item.id : null
          );
        }
      })
      .then(this.setState({ icon: "" }));
  };

  render() {
    const { open, edit, item } = this.props;

    const { getFieldDecorator } = this.props.form;

    const defaultImage = item
      ? item.icon
        ? [{ name: item.icon, path_relative: item.icon }]
        : ""
      : "";

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
            width="40%"
          >
            <Form {...formItemLayout} onSubmit={this.onFinish}>
              <Form.Item label={<IntlMessages id="global.title" />}>
                {getFieldDecorator("title", {
                  initialValue: item ? item.title || "" : "",
                })(<Input />)}
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

export default Form.create({ name: "room" })(AddRoom);
