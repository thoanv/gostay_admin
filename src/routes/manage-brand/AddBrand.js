import { Button, Col, Form, Input, Modal, Radio, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
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

class AddHotelUtilities extends Component {
  formRef = React.createRef();
  static propTypes = {
    open: PropTypes.bool,
    onCloseÍnurrance: PropTypes.func,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onHandleClose = () => {
    this.props.onClose();
  };

  uploadPicture = (e) => {
    this.setState({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      picturePreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile: e.target.files[0],
    });
  };
 
  onFinish = (e) => {
    e.preventDefault();
    
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          const formData = new FormData();
          if(this.state.pictureAsFile) formData.append("icon", this.state.pictureAsFile);
          formData.append("name", values.title);
          if(this.props.edit) {
            formData.append("edit", this.props.edit);
            formData.append("id", this.props.item.id);
          }
          this.props.onSave(formData);
        }
      })
     
  };

  render() {
    const { open, edit = false, item} = this.props;

    const { getFieldDecorator } = this.props.form;

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
                  initialValue: item ? item.name || "" : "",
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="global.image" />}>
              <input type="file" name="myImage" onChange={this.uploadPicture} />
              </Form.Item>
              {/* <Form.Item>
                <img src={this.state.picturePreview}  />
              </Form.Item> */}
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

export default Form.create({ name: "Hotel_utilities" })(AddHotelUtilities);
