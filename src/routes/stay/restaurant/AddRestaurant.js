import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Tabs,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../../fileManager/InputChosseFile";
import SunEditor, { buttonList } from "suneditor-react";
import BaseSelect from "Components/Elements/BaseSelect";
import TextArea from "antd/lib/input/TextArea";
import CustomPlacesAutoComplete from "../../../components/Elements/CustomPlacesAutoComplete";
import { NotificationManager } from "react-notifications";

const { TabPane } = Tabs;

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

const formDesc = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

class AddRestaurant extends Component {
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
    image: "",
    item: null,
    gallery: [],
    longitude: 105.804817,
    latitude: 21.028511,
  };

  

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item && nextProps.item != this.props.item) {
      this.setState({
        gallery: nextProps.item ? nextProps.item.gallery : [],
        image: nextProps.item && nextProps.item.image && nextProps.item.image.length ? nextProps.item.image[0] : "",
      });
    }
  }

  onHandleClose = () => {
    this.props.onItemClose();
  };

  getValueChosseFile = (data) => {
    this.setState({
      ...this.state,
      gallery: data.length ? data.map((item) => item.path_relative) : [],
    });
  };

  getValueImage = (data) => {
    this.setState({
      ...this.state,
      
      image: data[0] ? data[0].path_relative : ""
    });
  };

  onSetLocation = (position, address, city_name) => {
    this.setState({
      ...this.state,
      latitude: +position.lat,
      longitude: +position.lng,
    });
  };

  onFinish = (e) => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var value = {
            ...values,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          };
          value.image = [this.state.image];
          value.gallery = this.state.gallery;
         
          this.props.onSaveItem(
            value,
            this.props.item ? this.props.item.id : null
          );
        } else {
          NotificationManager.error("Some fields are empty");
        }
      })
      .then(this.setState({ image: "", gallery: [] }));
  };

  render() {
    const { open, edit, item, countries } = this.props;

    const { getFieldDecorator } = this.props.form;

    const dedfaultGallery = item
      ? item.gallery
        ? this.state.gallery.map((el) => ({
            name: el,
            path_relative: el,
          }))
        : []
      : [];

   
      const defaultImage = item
      ? item.image && item.image.length
        ? [{ name: item.image, path_relative: item.image }]
        : []
      : [];
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
              <Tabs
                defaultActiveKey="1"
                onChange={(key) => this.setState({ activeTab: key })}
              >
                <TabPane tab={<IntlMessages id="global.base_info" />} key="basic">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      initialValue: item ? item.title || "" : "",
                      rules: [
                        { required: true, message: "Please input title!" },
                      ],
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
                          <IntlMessages id="global.inactive" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.country" />}>
                    {getFieldDecorator("country_id", {
                      initialValue: item ? item.country_id : "",
                      rules: [
                        { required: true, message: "Please select a country!" },
                      ],
                    })(
                      <BaseSelect
                        options={countries}
                        selected={item ? item.country_id : ""}
                        defaultText="Select one..."
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.address" />}>
                    {getFieldDecorator("address", {
                      initialValue: item ? item.address || "" : "",
                      rules: [
                        { required: true, message: "Please input address!" },
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.intro" />}>
                    {getFieldDecorator("intro", {
                      initialValue: item ? item.intro || "" : "",
                      rules: [
                        { required: true, message: "Please input intro!" },
                      ],
                    })(<TextArea />)}
                  </Form.Item>
                 
                  <Form.Item label={<IntlMessages id="global.location" />}>
                    {edit ? (
                      <CustomPlacesAutoComplete
                        onChange={this.onSetLocation}
                        defaultPosition={{
                          lat: +item.latitude,
                          lng: +item.longitude,
                        }}
                      ></CustomPlacesAutoComplete>
                    ) : (
                      <CustomPlacesAutoComplete
                        onChange={this.onSetLocation}
                      ></CustomPlacesAutoComplete>
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.image" />}>
                    <InputChosseFile
                      key="images"
                      onChange={this.getValueImage}
                      defautValue={defaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="global.desc" />} key="desc">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("desc", {
                      rules: [
                        {
                          required: false,
                          message: "Please input description!",
                        },
                      ],
                      initialValue: item != null ? item.desc || "" : "",
                    })(
                      <SunEditor
                        setContents={item ? item.desc : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="global.gallery" />} key="gallery">
                  <Form.Item {...formDesc}>
                    <InputChosseFile
                      key="gallery"
                      onChange={this.getValueChosseFile}
                      defautValue={dedfaultGallery}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
              </Tabs>
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

export default Form.create({ name: "amenity" })(AddRestaurant);
