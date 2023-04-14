import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import SunEditor, { buttonList } from "suneditor-react";
import IntlMessages from "Util/IntlMessages";
import { updateTicket } from "../../../actions/TicketAction";
import BaseRadioList from "../../../components/Elements/BaseRadios";
import InputChosseFile from "../../fileManager/InputChosseFile";

const { TabPane } = Tabs;
const { Option } = Select;
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

const inputCol = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class AddTicket extends Component {
  static propTypes = {
    ticket: PropTypes.object,
    onSaveTicket: PropTypes.func,
    open: PropTypes.bool
  };

  static defaultProps = {
    edit: false,
    open: false
  };

  state = {
    current_ticket: null,
    image: "",
    gallery: [],
    value: 1,
    country_id: 0,
    filter: { paging: 0 },
    day: 0,
    city_id: 0,
    cate: 0,
    currentTicket: null
  };

  static getDerivedStateFromProps(props, state) {
    if (state.currentTicket !== props.ticket) {
      return {
        currentTicket: props.ticket,
        cate: props.ticket ? props.ticket.category : 0,
        image: props.ticket
          ? props.ticket.image
            ? props.ticket.image
            : ""
          : "",
        gallery: props.ticket
          ? props.ticket.gallery
            ? JSON.parse(props.ticket.gallery)
            : []
          : []
      };
    }
    return null;
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ticket && nextProps.ticket != this.props.ticket) {
      this.setState({
        ...nextProps,
        image: nextProps.ticket ? nextProps.ticket.image : "",
        gallery: nextProps.ticket ? nextProps.ticket.gallery : [],
        day: nextProps.ticket ? nextProps.ticket.days : 0,
        city_id: nextProps.ticket ? nextProps.ticket.city_id : 0,
        country_id: nextProps.ticket ? nextProps.ticket.country_id : 0,
        cate: nextProps.ticket ? nextProps.ticket.category : 0,
      });
    }
  }

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      gallery: data.length ? data.map(item => item.path_relative) : []
    });
  };

  getValueImage = data => {
    this.setState(
      {
        ...this.state,
        image: data.length ? data[0].path_relative : ""
      }

    );
  };

  onChangeData = event => {
    this.setState(
      {
        ...this.state,
        country_id: event,
        city_id: ""
      },

    );
  };

  onChangeDestination = id => {
    this.setState({
      ...this.state,
      city_id: id
    });
  };

  getDuration = event => {
    this.setState({
      ...this.state,
      day: event
    });
  };
  changeCategory = e => {

    this.setState({
      ...this.state,
      cate: e
    });

  }
  onHandleClose = () => {
    this.setState({
      ...this.state,
      open: !this.state.open,
      ticket: null,
      image: "",
      day: 0,
      city_id: 0,
      country_id: 0
    });
    this.props.onTicketClose();
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var ticket = {
          ...values
        };
        ticket.image = this.state.image;
        ticket.type = 2;
        ticket.gallery = JSON.stringify(this.state.gallery);
        this.props.onSaveTicket(
          ticket,
          this.props.ticket ? this.props.ticket.id : null
        ).then(res => this.setState({
          image: "",
          gallery:[]
        }))
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
      this.setState({
        ticket: null
      });
    });
  };

  render() {

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

    const {
      onTicketClose,
      open,
      edit,
      ticket,
      categories,
      countries,
      destination,
      isLoading
    } = this.props;




    const defaultGallery = ticket
      ? ticket.gallery
        ? this.state.gallery.map(item => ({
          name: item,
          path_relative: item
        }))
        : []
      : [];

    const defaultImage = ticket
      ? ticket.image
        ? [{ name: ticket.image, path_relative: ticket.image }]
        : []
      : [];


    var days = ticket ? +ticket.days : null;

    var nights = ticket ? +ticket.nights : null;

    var durations = ticket ? +ticket.duration : null;

    const { getFieldDecorator } = this.props.form;

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
            visible={open}
            closable={true}
            onCancel={this.onHandleClose}
            footer={null}
            destroyOnClose={true}
            width="50%"
            top={50}
          >
            <Form
              onSubmit={this.Update}
              {...formItemLayout}
              style={{ width: "100%" }}
            >
              <Tabs
                defaultActiveKey="1"
                onChange={key => this.setState({ activeTab: key })}

              >
                <TabPane tab="Basic" key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input ticket title!"
                        }
                      ],
                      initialValue: ticket ? ticket.title || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.country" />}>
                    {getFieldDecorator("country_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select country!"
                        }
                      ],
                      initialValue: ticket ? ticket.country_id : ""
                    })(
                      <BaseSelect
                        options={countries}
                        selected={ticket ? ticket.country_id : ""}
                        defaultText="Select one..."
                        showSearch={true}
                        onChange={this.onChangeData}
                      />
                    )}
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        {...inputCol}
                        label={<IntlMessages id="ticket.adultprice" />}
                      >
                        {getFieldDecorator("price", {
                          rules: [
                            {
                              required: true,
                              message: "Please input price!"
                            }
                          ],
                          initialValue: ticket ? +ticket.price : 0
                        })(<InputNumber style={{ width: "100%" }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...inputCol}
                        label={<IntlMessages id="ticket.childprice" />}
                      >
                        {getFieldDecorator("price_child", {
                          rules: [
                            {
                              required: true,
                              message: "Please input price of child!"
                            }
                          ],
                          initialValue: ticket ? +ticket.price_child : 0
                        })(<InputNumber style={{ width: "100%" }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label={<IntlMessages id="ticket.duration" />}>
                    {getFieldDecorator("duration", {
                      rules: [
                        {
                          required: true,
                          message: "Please input duration!"
                        }
                      ],
                      initialValue: ticket ? ticket.duration || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: ticket ? (ticket.status ? 1 : 0) : 1
                    })(
                      <BaseRadioList
                        options={[
                          {
                            id: 0,
                            title: <IntlMessages id="global.unpublish" />
                          },
                          { id: 1, title: <IntlMessages id="global.publish" /> }
                        ]}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.image" />}>
                    <InputChosseFile
                      key="image"
                      onChange={this.getValueImage}
                      defautValue={defaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
                <TabPane tab=" Short Description" key="2">
                  <Form.Item {...formDesc}>

                    {getFieldDecorator("short_desc", {
                      rules: [
                        {
                          message: "Please input ticket short description!"
                        }
                      ],
                      initialValue: ticket ? ticket.short_desc || "" : ""
                    })(<Input />)}
                  </Form.Item>
                </TabPane>

                <TabPane tab="Description" key="3">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("description", {
                      rules: [
                        {
                          message: "Please input ticket description!"
                        }
                      ],
                      initialValue:
                        ticket ? ticket.description || "" : ""
                    })(
                      <SunEditor
                        setContents={ticket ? ticket.description : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Terms" key="terms">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("condition", {
                      rules: [
                        {
                          message: "Please input your terms!"
                        }
                      ],
                      initialValue:
                        ticket ? ticket.condition || "" : ""
                    })(
                      <SunEditor
                        setContents={ticket ? ticket.condition : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Gallery" key="gallery">
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
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.onHandleClose()}
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    updateTicket: data => dispatch(updateTicket(data))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "AddTicket" })(AddTicket);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
