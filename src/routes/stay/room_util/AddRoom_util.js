import { Button, Col, Form, Input, Modal, Radio, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
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

class AddRoom_util extends Component {
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
    this.props.onClose();
  };

 
 
  onFinish = (e) => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var value = { ...values };
          console.log(value);
          this.props.onSave(
            value,
            this.props.item ? this.props.item.id : null
          );
        }
      })
     
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { open, edit, item ,listRoomUtilType} = this.props;

    const { getFieldDecorator } = this.props.form;
    var roomutiltypes = listRoomUtilType.map((item) => {
        return {
          id: item.id.toString(),
          title: item.title,
        };
      });
    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={edit ? "Edit" : "Add"}
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
              <Form.Item label={<IntlMessages id="global.type" />}>
                    {getFieldDecorator("type_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please input type!",
                        },
                      ],
                      initialValue: item
                        ? item.type_id.toString() || ""
                        : "",
                    })(
                      <BaseSelect
                        options={roomutiltypes}
                        selected={item ? item.type_id : ""}
                        defaultText="Select a type"
                        showSearch={true}
                      />
                    )}
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

export default Form.create({ name: "Room_util" })(AddRoom_util);
