import { Button, Col, Form, Input, Modal, Row } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import 'react-image-crop/dist/ReactCrop.css';
import './style.css';
import Cropper from "react-easy-crop";
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

class AddSliderUtilities extends Component {
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
    this.state = {
     round: {
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 100 / 17,
     }
    };
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

  uploadPictureSquare = (e) => {
    this.setState({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      pictureSqrPreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureSqrAsFile: e.target.files[0],
    });
  };
 
  onFinish = (e) => {
    e.preventDefault();
    
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          const formData = new FormData();
          if(this.state.pictureAsFile) formData.append("img", this.state.blobRound);
          formData.append("link", values.title);
          formData.append("name", values.name);
          if(this.props.edit) {
            formData.append("edit", this.props.edit);
            formData.append("id", this.props.item.id);
          }
          this.props.onSave(formData);
        }
      })
     
  };

  getCroppedImg = async (src, pixelCrop, fileName = "round") => {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    const image = await this.createImage(src)
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
      window.URL.revokeObjectURL(this.fileUrl);
      this.fileUrl = window.URL.createObjectURL(blob);
      resolve(this.fileUrl);
      this.setState({ blobRound: blob})
        
      }, "image/jpeg");
    });
  }

  onCropChange = (crop, shape) => {
      let round = {...this.state.round}
      this.setState({ round: {...round, crop} })
  }

  onCropComplete = (croppedArea, croppedAreaPixels, shape = "round") => {
    this.getCroppedImg(this.state.picturePreview,
      croppedAreaPixels,
      shape
    )
  }

  createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

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
              <Form.Item label={<IntlMessages id="button.link" />}>
                {getFieldDecorator("title", {
                  initialValue: item ? item.link || "" : "",
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="global.title" />}>
                {getFieldDecorator("name", {
                  initialValue: item ? item.name || "" : "",
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<IntlMessages id="mpu.img_circle" />}>
              <input type="file" name="myImage" onChange={this.uploadPicture} />
              </Form.Item>
              <Form.Item>
                <div className="image-popup">
                {this.state.picturePreview &&
                  <Cropper
                  cropShape="rect"
                  image={this.state.picturePreview}
                  crop={this.state.round.crop}
                  zoom={this.state.round.zoom}
                  aspect={this.state.round.aspect}
                  onCropChange={(c) => this.onCropChange(c, 'round')}
                  onCropComplete={(c,c1) => this.onCropComplete(c,c1, "round")}
                />}
                </div>
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

export default Form.create({ name: "Slider_utilities" })(AddSliderUtilities);
