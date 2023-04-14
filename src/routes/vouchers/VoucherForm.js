import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Row, Col, Button, Modal, Upload, Icon } from "antd";
import { convertFileToBase64, getFileExtension } from "../../helpers/helpers";
import { upload } from "../../actions/FileManagerActions";
import { NotificationManager } from "react-notifications";
import SunEditor, { buttonList } from "suneditor-react";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

class VoucherForm extends Component {
  static propTypes = {
    current_current_passenger: PropTypes.object,
    onSavePassenger: PropTypes.func,
    open: PropTypes.bool,
    onPassengerClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    filter: {
      paging: {
        page: 1
      }
    },
    fileList: [],
    uploading: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.current_voucher &&
      nextProps.current_voucher !== this.props.current_voucher
    ) {
      this.setState({
        description: nextProps.current_voucher.description
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(
      async (err, values) => {
        if (!err) {
          var file = this.state.fileList[0];

          var current_voucher = {};
          if (file !== undefined) {
            var base64Data = await convertFileToBase64(file);
            var extension = getFileExtension(file.name);
            current_voucher = {
              ...values,
              file: base64Data,
              filename: file.name
            };
          } else {
            current_voucher = { ...values };
          }

          this.props.onSaveVoucher(
            current_voucher,
            this.props.current_voucher ? this.props.current_voucher.id : null
          );
        } else {
          NotificationManager.error(
            "Please fill out all inputs and try again!"
          );
        }
        this.setState({
          description: "",
          fileList: []
        });
      }
      // () => {
      //   this.setState({ description: "" });
      // }
    );
  };

  handleChange = event => {
    // console.log(event);
  };

  handleImageUpload(
    targetImgElement,
    index,
    state,
    imageInfo,
    remainingFilesCount
  ) {
    console.log(imageInfo);
  }

  handleClose = () => {
    this.props.onCloseOrderVoucher();
    this.setState({
      description: "",
      fileList: []
    });
  };

  render() {
    const {
      openVoucher,
      onCloseOrderVoucher,
      edit,
      current_voucher
    } = this.props;

    const { description } = this.state;

    const { fileList } = this.state;

    const uploadProps = {
      multiple: false,
      onRemove: file => {
        this.setState({
          fileList: []
        });
      },
      beforeUpload: file => {
        // console.log(file);
        this.setState({
          fileList: [file]
        });
        return false;
      },
      fileList: fileList,
      defaultFileList: fileList
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        {openVoucher ? (
          <Modal
            title={edit ? "Edit voucher" : "Create voucher"}
            toggle={this.handleClose}
            visible={openVoucher}
            closable={true}
            onCancel={this.handleClose}
            footer={null}
            width="50%"
          >
            <Form onSubmit={this.handleSubmit} {...formItemLayout}>
              <Form.Item>
                {getFieldDecorator("title", {
                  rules: [{ required: true, message: "Please input title!" }],
                  initialValue: current_voucher
                    ? current_voucher.title || ""
                    : ""
                })(<Input style={{ width: "100%" }} placeholder="Title" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: false,
                      message: "Please input description!"
                    }
                  ],
                  initialValue:
                    current_voucher != null ? current_voucher.description : ""
                })(
                  <SunEditor
                    onChange={this.handleChange}
                    setContents={description}
                    onImageUpload={this.handleImageUpload}
                    placeholder="Please type here..."
                    setOptions={{
                      buttonList: buttonList.complex
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("filename", {
                  rules: [
                    {
                      required: false,
                      message: "Please input filename!"
                    }
                  ]
                  // initialValue:
                  //   current_voucher != null ? current_voucher.filepath : ""
                })(
                  <Upload {...uploadProps}>
                    <Button type="primary">
                      <Icon type="upload" />
                      <IntlMessages id="global.uploaddocument" />
                    </Button>
                  </Upload>
                )}
              </Form.Item>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={this.handleClose}
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
    listCountry: state.country.listCountry
  };
}

function mapDispatchToProps(dispatch) {
  return {
    upload: data => dispatch(upload(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: "voucher" })(VoucherForm));
