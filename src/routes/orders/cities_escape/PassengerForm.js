import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Radio,
  Tabs,
  DatePicker
} from "antd";
import InputChosseFile from "../../fileManager/InputChosseFile";
import { getAllCountry } from "../../../actions/CountryActions";
import moment from "moment";

class PassengerForm extends Component {
  static propTypes = {
    current_current_passenger: PropTypes.object,
    onSavePassenger: PropTypes.func,
    open: PropTypes.bool,
    onPassengerClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    currentPassenger: null,
    filter: {
      paging: {
        page: 1
      }
    },
    filterCountry: {
      paging: 0
    },
    passport_image: ""
  };

  componentDidMount() {
    this.props.getAllCountry(this.state.filterCountry);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (
      nextProps.current_passenger &&
      nextProps.current_passenger !== this.props.current_passenger
    ) {
      console.log(nextProps.current_passenger.passport_image);
      this.setState({
        ...nextProps,
        passport_image: nextProps.current_passenger.passport_image
      });
    }
  }

  getValueImage = data => {
    this.setState(
      {
        ...this.state,
        passport_image: data.length ? data[0].path_relative : ""
      },
      () => console.log("aaa", this.state.passport_image)
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var current_passenger = { ...values };
        current_passenger.passport_image = this.state.passport_image;
        this.props.onSavePassenger(
          current_passenger,
          this.props.current_passenger ? this.props.current_passenger.id : null
        );
      }
    });
  };

  onClose() {
    this.setState({
      current_passenger: null
    });
    this.props.onCloseOrderPassenger();
  }

  render() {
    var countryName = this.props.listCountry.map(item => {
      return {
        id: item.id,
        title: item.title
      };
    });

    const {
      openPassenger,
      onPassengerClose,
      edit,
      current_passenger
    } = this.props;

    console.log(current_passenger);

    const { getFieldDecorator } = this.props.form;
    const defaultImages = current_passenger
      ? current_passenger.passport_image
        ? [
            {
              name: current_passenger.passport_image,
              path_relative: current_passenger.passport_image
            }
          ]
        : []
      : [];
    const { TabPane } = Tabs;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <React.Fragment>
        {openPassenger ? (
          <Modal
            title={edit ? <IntlMessages id="passenger.editPassenger" /> : ""}
            toggle={onPassengerClose}
            visible={openPassenger}
            closable={true}
            onCancel={() => this.onClose()}
            footer={null}
            width="70%"
          >
            <Form onSubmit={this.handleSubmit} {...formItemLayout}>
              <Row style={{ display: "flex", justifyContent: "flex-start" }}>
                <Col span={8}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.firstname" />}
                  >
                    {getFieldDecorator("firstname", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your first name !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.firstname || ""
                        : ""
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.middlename" />}
                  >
                    {getFieldDecorator("middle_name", {
                      initialValue: current_passenger
                        ? current_passenger.middle_name || ""
                        : ""
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.lastname" />}
                  >
                    {getFieldDecorator("lastname", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your last name !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.lastname || ""
                        : ""
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.gender" />}
                  >
                    {getFieldDecorator("gender", {
                      initialValue: current_passenger
                        ? +current_passenger.gender
                          ? 1
                          : 0
                        : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="order.passenger.male" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="order.passenger.female" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.country" />}
                  >
                    {getFieldDecorator("country_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select a country !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.country_id
                        : ""
                    })(
                      <BaseSelect
                        showSearch
                        options={countryName}
                        defaultText="Select a country"
                        optionValue="id"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.country_born" />}
                  >
                    {getFieldDecorator("born_country_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select a country !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.born_country_id
                        : ""
                    })(
                      <BaseSelect
                        showSearch
                        options={countryName}
                        defaultText="Select a country"
                        optionValue="id"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.passport" />}
                  >
                    {getFieldDecorator("passport_no", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your passport no !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.passport_no || ""
                        : ""
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="order.passenger.expiry" />}
                  >
                    {getFieldDecorator("expired", {
                      rules: [
                        {
                          required: true,
                          message: "Please pick a date !"
                        }
                      ],
                      initialValue: current_passenger
                        ? current_passenger.expired
                          ? moment(current_passenger.expired)
                          : moment()
                        : moment()
                    })(
                      <DatePicker
                        placeholder="Pick date"
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label={<IntlMessages id="passenger.passport_image" />}
                  >
                    <InputChosseFile
                      key="passport_image"
                      onChange={this.getValueImage}
                      defautValue={defaultImages}
                    ></InputChosseFile>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="default" onClick={() => this.onClose()}>
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

function mapStateToProps(state) {
  return {
    listCountry: state.country.listCountry
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // getAllTour: (filter, paginate) => dispatch(getAllTour(filter, paginate)),
    getAllCountry: filter => dispatch(getAllCountry(filter))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: "current_passenger" })(PassengerForm));
