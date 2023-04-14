import React, { Component } from "react";
import { connect } from "react-redux";
import SunEditor, { buttonList } from "suneditor-react";
import { Form, Input, Row, Col, Modal, Radio, Button, Tabs } from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateOffice } from "../../../actions/OfficeAction";
import TextArea from "antd/lib/input/TextArea";
import BaseSelect from "Components/Elements/BaseSelect";

const { TabPane } = Tabs;

const TimeZone = [
  {
    offset: "GMT-12:00",
    id: "Etc/GMT-12"
  },
  {
    offset: "GMT-11:00",
    id: "Etc/GMT-11"
  },
  {
    offset: "GMT-11:00",
    id: "Pacific/Midway"
  },
  {
    offset: "GMT-10:00",
    id: "America/Adak"
  },
  {
    offset: "GMT-09:00",
    id: "America/Anchorage"
  },
  {
    offset: "GMT-09:00",
    id: "Pacific/Gambier"
  },
  {
    offset: "GMT-08:00",
    id: "America/Dawson_Creek"
  },
  {
    offset: "GMT-08:00",
    id: "America/Ensenada"
  },
  {
    offset: "GMT-08:00",
    id: "America/Los_Angeles"
  },
  {
    offset: "GMT-07:00",
    id: "America/Chihuahua"
  },
  {
    offset: "GMT-07:00",
    id: "America/Denver"
  },
  {
    offset: "GMT-06:00",
    id: "America/Belize"
  },
  {
    offset: "GMT-06:00",
    id: "America/Cancun"
  },
  {
    offset: "GMT-06:00",
    id: "America/Chicago"
  },
  {
    offset: "GMT-06:00",
    id: "Chile/EasterIsland"
  },
  {
    offset: "GMT-05:00",
    id: "America/Bogota"
  },
  {
    offset: "GMT-05:00",
    id: "America/Havana"
  },
  {
    offset: "GMT-05:00",
    id: "America/New_York"
  },
  {
    offset: "GMT-04:30",
    id: "America/Caracas"
  },
  {
    offset: "GMT-04:00",
    id: "America/Campo_Grande"
  },
  {
    offset: "GMT-04:00",
    id: "America/Glace_Bay"
  },
  {
    offset: "GMT-04:00",
    id: "America/Goose_Bay"
  },
  {
    offset: "GMT-04:00",
    id: "America/Santiago"
  },
  {
    offset: "GMT-04:00",
    id: "America/La_Paz"
  },
  {
    offset: "GMT-03:00",
    id: "America/Argentina/Buenos_Aires"
  },
  {
    offset: "GMT-03:00",
    id: "America/Montevideo"
  },
  {
    offset: "GMT-03:00",
    id: "America/Araguaina"
  },
  {
    offset: "GMT-03:00",
    id: "America/Godthab"
  },
  {
    offset: "GMT-03:00",
    id: "America/Miquelon"
  },
  {
    offset: "GMT-03:00",
    id: "America/Sao_Paulo"
  },
  {
    offset: "GMT-03:30",
    id: "America/St_Johns"
  },
  {
    offset: "GMT-02:00",
    id: "America/Noronha"
  },
  {
    offset: "GMT-01:00",
    id: "Atlantic/Cape_Verde"
  },
  {
    offset: "GMT",
    id: "Europe/Belfast"
  },
  {
    offset: "GMT",
    id: "Africa/Abidjan"
  },
  {
    offset: "GMT",
    id: "Europe/Dublin"
  },
  {
    offset: "GMT",
    id: "Europe/Lisbon"
  },
  {
    offset: "GMT",
    id: "Europe/London"
  },
  {
    offset: "UTC",
    id: "UTC"
  },
  {
    offset: "GMT+01:00",
    id: "Africa/Algiers"
  },
  {
    offset: "GMT+01:00",
    id: "Africa/Windhoek"
  },
  {
    offset: "GMT+01:00",
    id: "Atlantic/Azores"
  },
  {
    offset: "GMT+01:00",
    id: "Atlantic/Stanley"
  },
  {
    offset: "GMT+01:00",
    id: "Europe/Amsterdam"
  },
  {
    offset: "GMT+01:00",
    id: "Europe/Belgrade"
  },
  {
    offset: "GMT+01:00",
    id: "Europe/Brussels"
  },
  {
    offset: "GMT+02:00",
    id: "Africa/Cairo"
  },
  {
    offset: "GMT+02:00",
    id: "Africa/Blantyre"
  },
  {
    offset: "GMT+02:00",
    id: "Asia/Beirut"
  },
  {
    offset: "GMT+02:00",
    id: "Asia/Damascus"
  },
  {
    offset: "GMT+02:00",
    id: "Asia/Gaza"
  },
  {
    offset: "GMT+02:00",
    id: "Asia/Jerusalem"
  },
  {
    offset: "GMT+03:00",
    id: "Africa/Addis_Ababa"
  },
  {
    offset: "GMT+03:00",
    id: "Asia/Riyadh89"
  },
  {
    offset: "GMT+03:00",
    id: "Europe/Minsk"
  },
  {
    offset: "GMT+03:30",
    id: "Asia/Tehran"
  },
  {
    offset: "GMT+04:00",
    id: "Asia/Dubai"
  },
  {
    offset: "GMT+04:00",
    id: "Asia/Yerevan"
  },
  {
    offset: "GMT+04:00",
    id: "Europe/Moscow"
  },
  {
    offset: "GMT+04:30",
    id: "Asia/Kabul"
  },
  {
    offset: "GMT+05:00",
    id: "Asia/Tashkent"
  },
  {
    offset: "GMT+05:30",
    id: "Asia/Kolkata"
  },
  {
    offset: "GMT+05:45",
    id: "Asia/Katmandu"
  },
  {
    offset: "GMT+06:00",
    id: "Asia/Dhaka"
  },
  {
    offset: "GMT+06:00",
    id: "Asia/Yekaterinburg"
  },
  {
    offset: "GMT+06:30",
    id: "Asia/Rangoon"
  },
  {
    offset: "GMT+07:00",
    id: "Asia/Bangkok"
  },
  {
    offset: "GMT+07:00",
    id: "Asia/Novosibirsk"
  },
  {
    offset: "GMT+08:00",
    id: "Etc/GMT+8"
  },
  {
    offset: "GMT+08:00",
    id: "Asia/Hong_Kong"
  },
  {
    offset: "GMT+08:00",
    id: "Asia/Krasnoyarsk"
  },
  {
    offset: "GMT+08:00",
    id: "Australia/Perth"
  },
  {
    offset: "GMT+08:45",
    id: "Australia/Eucla"
  },
  {
    offset: "GMT+09:00",
    id: "Asia/Irkutsk"
  },
  {
    offset: "GMT+09:00",
    id: "Asia/Seoul"
  },
  {
    offset: "GMT+09:00",
    id: "Asia/Tokyo"
  },
  {
    offset: "GMT+09:30",
    id: "Australia/Adelaide"
  },
  {
    offset: "GMT+09:30",
    id: "Australia/Darwin"
  },
  {
    offset: "GMT+09:30",
    id: "Pacific/Marquesas"
  },
  {
    offset: "GMT+10:00",
    id: "Etc/GMT+10"
  },
  {
    offset: "GMT+10:00",
    id: "Australia/Brisbane"
  },
  {
    offset: "GMT+10:00",
    id: "Australia/Hobart"
  },
  {
    offset: "GMT+10:00",
    id: "Asia/Yakutsk"
  },
  {
    offset: "GMT+10:30",
    id: "Australia/Lord_Howe"
  },
  {
    offset: "GMT+11:00",
    id: "Asia/Vladivostok"
  },
  {
    offset: "GMT+11:30",
    id: "Pacific/Norfolk"
  },
  {
    offset: "GMT+12:00",
    id: "Etc/GMT+12"
  },
  {
    offset: "GMT+12:00",
    id: "Asia/Anadyr"
  },
  {
    offset: "GMT+12:00",
    id: "Asia/Magadan"
  },
  {
    offset: "GMT+12:00",
    id: "Pacific/Auckland"
  },
  {
    offset: "GMT+12:45",
    id: "Pacific/Chatham"
  },
  {
    offset: "GMT+13:00",
    id: "Pacific/Tongatapu"
  },
  {
    offset: "GMT+14:00",
    id: "Pacific/Kiritimati"
  }
];

class AddOffice extends Component {
  static propTypes = {
    office: PropTypes.object,
    onSaveOffice: PropTypes.func,
    open: PropTypes.bool,
    onOfficeClose: PropTypes.func
  };

  static defaultProps = {
    office: {},
    edit: false,
    open: false
  };

  state = {
    office: null,
    value: 1
  };

  onChangeData(event) {
    var target = event.target;
    var name = target.name;
    var value = target.type === "checked" ? target.checked : target.value;
    if (name === "status") {
      value = target.value === 1 ? true : false;
      console.log("value", value);
    }
    this.setState({
      [name]: value
    });
  }

  onHandleClose = () => {
    this.setState({
      ...this.state,
      open: !this.state.open
    });
  };

  Update = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var office = {
          ...values,
          logo: this.state.logo
        };
        this.props.onSaveOffice(
          office,
          this.props.office ? this.props.office.id : null
        );
      }
      this.setState({
        office: null
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
    const { onOfficeClose, open, edit, office, countries } = this.props;

    const { getFieldDecorator } = this.props.form;



    const listTimeZone = TimeZone.map(item => {
      return {
        id: item.id,
        title: "(" + item.offset + ") " + item.id
      };
    });

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

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="office.edit" />
              ) : (
                  <IntlMessages id="office.create" />
                )
            }
            visible={open}
            onCancel={onOfficeClose}
            closable={true}
            footer={null}
            width="50%"
          >
            <Form
              onSubmit={this.Update}
              {...formItemLayout}
              style={{ width: "100%" }}
            >
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        { required: true, message: "Please input your title!" }
                      ],
                      initialValue: office ? office.title || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.address" />}>
                    {getFieldDecorator("address", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your address!"
                        }
                      ],
                      initialValue: office ? office.address || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.phone" />}>
                    {getFieldDecorator("phone", {
                      rules: [
                        { required: true, message: "Please input your phone!" }
                      ],
                      initialValue: office ? office.phone || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.tax_code" />}>
                    {getFieldDecorator("tax_code", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your tax_code!"
                        }
                      ],
                      initialValue: office ? office.tax_code || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="office.license" />}>
                    {getFieldDecorator("license", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your license!"
                        }
                      ],
                      initialValue: office ? office.license || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.description" />}>
                    {getFieldDecorator("description", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your description!"
                        }
                      ],
                      initialValue: office ? office.description || "" : ""
                    })(<TextArea style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.country" />}>
                    {getFieldDecorator("country_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select your country!"
                        }
                      ],
                      initialValue: office ? office.country_id : ""
                    })(
                      <BaseSelect
                        options={countries}
                        selected={office ? office.country_id : ""}
                        defaultText="Select a country"
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="office.timezone" />}>
                    {getFieldDecorator("timezone", {
                      rules: [
                        {
                          required: true,
                          message: "Please select your time zone!"
                        }
                      ],
                      initialValue: office ? office.timezone : "(UTC) UTC"
                    })(
                      <BaseSelect
                        options={listTimeZone}
                        selected={office ? office.timezone : "(UTC) UTC"}
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: office ? (office.status ? 1 : 0) : 1
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
                <TabPane tab={<IntlMessages id="office.inf_pay" />} key="2">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("inf_pay", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your infomation pay!"
                        }
                      ],
                      initialValue: office != null ? office.inf_pay || "" : ""
                    })(
                      <SunEditor
                        setContents={office != null ? office.inf_pay || "" : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.props.onOfficeClose()}
                  >
                    <IntlMessages id="global.cancel" />
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    htmlType="submit"
                  // loading={this.props.loading}
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
    listOffice: state.office.listOffice
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateOffice: data => dispatch(updateOffice(data))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "AddOffice" })(AddOffice);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
