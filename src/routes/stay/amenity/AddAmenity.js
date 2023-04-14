import { Button, Col, Form, Input, Modal, Radio, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../../fileManager/InputChosseFile";

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

class AddAmenity extends Component {
  formRef = React.createRef();
  static propTypes = {
    open: PropTypes.bool,
    onCloseÍnurrance: PropTypes.func,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  state = {
    icon: "",
  };

  onHandleClose = () => {
    this.props.onItemClose();
  };

  getValueImage = (data) => {
    this.setState({
      ...this.state,
      icon: data.length ? data[0].path_relative : "",
    });
  };

  onChange = (e) => {
    console.log(e.target.checked);
    this.setState({
      checkCompany: e.target.checked,
    });
  };

  onFinish = (e) => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var value = { ...values };
          value.icon = this.state.icon;
          console.log(value);
          this.props.onSaveItem(
            value,
            this.props.item ? this.props.item.id : null
          );
        }
      })
      .then(this.setState({ icon: "" }));
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
            width="60%"
          >
            <Form {...formItemLayout} onSubmit={this.onFinish}>
              <Form.Item label={<IntlMessages id="global.title" />}>
                {getFieldDecorator("title", {
                  initialValue: item ? item.title || "" : "",
                })(<Input />)}
              </Form.Item>

              <Form.Item label={<IntlMessages id="global.status" />}>
                {getFieldDecorator("status", {
                  initialValue: item ? (item.status === 1 ? 1 : 0) : 1,
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
              <Form.Item label={<IntlMessages id="global.icon" />}>
                <InputChosseFile
                  key="images"
                  onChange={this.getValueImage}
                  defautValue={defaultImage}
                ></InputChosseFile>
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

export default Form.create({ name: "amenity" })(AddAmenity);
