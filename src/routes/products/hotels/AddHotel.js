import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Modal,
  Radio,
  Tabs,
  Rate
} from "antd";
import InputChosseFile from "../../fileManager/InputChosseFile";
import CustomPlacesAutoComplete from "../../../components/Elements/CustomPlacesAutoComplete";
import SunEditor, { buttonList } from "suneditor-react";

const { TabPane } = Tabs;
const { TextArea } = Input;
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
const formDesc = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};
const InputLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const hours = [
  { id: 1, title: "am" },
  { id: 2, title: "am" },
  { id: 3, title: "am" },
  { id: 4, title: "am" },
  { id: 5, title: "am" },
  { id: 6, title: "am" },
  { id: 7, title: "am" },
  { id: 8, title: "am" },
  { id: 9, title: "am" },
  { id: 10, title: "am" },
  { id: 11, title: "am" },
  { id: 12, title: "am" },
  { id: 1, title: "pm" },
  { id: 2, title: "pm" },
  { id: 3, title: "pm" },
  { id: 4, title: "pm" },
  { id: 5, title: "pm" },
  { id: 6, title: "pm" },
  { id: 7, title: "pm" },
  { id: 8, title: "pm" },
  { id: 9, title: "pm" },
  { id: 10, title: "pm" },
  { id: 11, title: "pm" },
  { id: 12, title: "pm" }
];

class AddHotel extends Component {
  static propTypes = {
    hotel: PropTypes.object,
    onSaveHotel: PropTypes.func,
    open: PropTypes.bool,
    onHotelClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    hotel: null,
    rank: 1,
    images: [],
    latitude: 0,
    longitude: 0
  };

  static getDerivedStateFromProps(props, state) {
    if (props.hotel !== state.hotel) {
      return {
        ...state,
        hotel: props.hotel,
        rank: props.hotel ? props.hotel.rank : 1,
        images: props.hotel
          ? props.hotel.images
            ? JSON.parse(props.hotel.images)
            : []
          : []
      };
    }
    return null;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var hotel = {
          ...values,
          latitude: this.state.latitude,
          longitude: this.state.longitude
        };
        hotel.rank = this.state.rank;
        hotel.images = JSON.stringify(this.state.images);
        this.props.onSaveHotel(
          hotel,
          this.props.hotel ? this.props.hotel.id : null
        );
      }
    });
  };

  handleChange = value => {
    this.setState({
      ...value,
      rank: value
    });
  };

  onSetLocation = (position, address, city_name) => {
    this.setState({
      ...this.state,
      latitude: +position.lat,
      longitude: +position.lng
    });
  };

  onHandleClose = () => {
    this.setState({
      ...this.state,
      open: !this.state.open
    });
    this.props.onHotelClose();
  };

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      images: data.length ? data.map(item => item.path_relative) : []
    });
  };

  render() {
    const { hotel, open, onHotelClose, edit, listDestination } = this.props;

    const { getFieldDecorator } = this.props.form;
    const destinations = listDestination.map(item => {
      return {
        id: item.id,
        title: item.title
      };
    });

    const defaultGallery = hotel
      ? hotel.images
        ? JSON.parse(hotel.images).map(image => {
            return { name: image, path_relative: image };
          })
        : []
      : [];

    const hour = hours.map(item => {
      return {
        id: `${item.id}:00 ${item.title}`,
        title: `${item.id}:00 ${item.title}`
      };
    });

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
            toggle={onHotelClose}
            visible={open}
            closable={true}
            onCancel={this.onHandleClose}
            footer={null}
            width="60%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="hotel.id" />}>
                    {getFieldDecorator("hotel_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please input hotel_id !"
                        }
                      ],
                      initialValue: hotel ? hotel.hotel_id || "" : ""
                    })(<InputNumber style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="hotel.name" />}>
                    {getFieldDecorator("name", {
                      rules: [
                        {
                          required: true,
                          message: "Please input name !"
                        }
                      ],
                      initialValue: hotel ? hotel.name || "" : ""
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.rank" />}>
                    {getFieldDecorator("rank", {
                      rules: [
                        {
                          required: true,
                          message: "Please select rank!"
                        }
                      ],
                      initialValue: hotel ? hotel.rank || 1 : 1
                    })(
                      <span>
                        <Rate
                          onChange={this.handleChange}
                          value={this.state.rank}
                        />
                      </span>
                    )}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="hotel.city" />}>
                    {getFieldDecorator("city_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select city!"
                        }
                      ],
                      initialValue: hotel ? hotel.city_id || 1 : 1
                    })(
                      <BaseSelect
                        options={destinations}
                        selected={hotel ? hotel.city_id : ""}
                        defaultText="Select a city"
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="hotel.checkin" />}
                        {...InputLayout}
                      >
                        {getFieldDecorator("checkin", {
                          rules: [
                            {
                              required: true,
                              message: "Please select your hour!"
                            }
                          ],
                          initialValue: hotel ? hotel.checkin : ""
                        })(
                          <BaseSelect
                            showSearch={true}
                            options={hour}
                            selected={hotel ? hotel.checkin : ""}
                            defaultText="Select hour"
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="hotel.checkout" />}
                        {...InputLayout}
                      >
                        {getFieldDecorator("checkout", {
                          rules: [
                            {
                              required: true,
                              message: "Please select your hour!"
                            }
                          ],
                          initialValue: hotel ? hotel.checkout : ""
                        })(
                          <BaseSelect
                            showSearch={true}
                            options={hour}
                            selected={hotel ? hotel.checkout : ""}
                            defaultText="Select hour"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label={<IntlMessages id="global.address" />}>
                    {getFieldDecorator("address", {
                      rules: [
                        {
                          required: true,
                          message: "Please input address !"
                        }
                      ],
                      initialValue: hotel ? hotel.address || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.location" />}>
                    {edit ? (
                      <CustomPlacesAutoComplete
                        onChange={this.onSetLocation}
                        defaultPosition={{
                          lat: +hotel.latitude,
                          lng: +hotel.longitude
                        }}
                      ></CustomPlacesAutoComplete>
                    ) : (
                      <CustomPlacesAutoComplete
                        onChange={this.onSetLocation}
                      ></CustomPlacesAutoComplete>
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: hotel ? (hotel.status ? 1 : 0) : 1
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
                </TabPane>
                <TabPane
                  tab={<IntlMessages id="global.notes_client" />}
                  key="2"
                >
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("notes_client", {
                      rules: [
                        {
                          required: true,
                          message: "Please input notes_client!"
                        }
                      ],
                      initialValue: hotel ? hotel.notes_client || "" : ""
                    })(
                      <SunEditor
                        setContents={hotel ? hotel.notes_client : ''}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="hotel.contact" />} key="3">
                  <Form.Item label={<IntlMessages id="hotel.contact_name" />}>
                    {getFieldDecorator("contact_name", {
                      rules: [
                        {
                          required: true,
                          message: "Please input contact name !"
                        }
                      ],
                      initialValue: hotel ? hotel.contact_name || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="hotel.contact_email" />}>
                    {getFieldDecorator("contact_email", {
                      rules: [
                        {
                          required: true,
                          message: "Please input contact email !"
                        }
                      ],
                      initialValue: hotel ? hotel.contact_email || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="hotel.contact_phone" />}>
                    {getFieldDecorator("contact_phone", {
                      rules: [
                        {
                          required: true,
                          message: "Please input contact phone !"
                        }
                      ],
                      initialValue: hotel ? hotel.contact_phone || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item
                    label={<IntlMessages id="hotel.contact_address" />}
                  >
                    {getFieldDecorator("contact_address", {
                      rules: [
                        {
                          required: true,
                          message: "Please input contact address !"
                        }
                      ],
                      initialValue: hotel ? hotel.contact_address || "" : ""
                    })(<Input />)}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="hotel.images" />} key="4">
                  <Form.Item {...formDesc}>
                    <InputChosseFile
                      key="gallery"
                      onChange={this.getValueChosseFile}
                      defautValue={defaultGallery}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    type="default"
                    onClick={() => this.props.onHotelClose()}
                  >
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

export default Form.create({ name: "hotel" })(AddHotel);
