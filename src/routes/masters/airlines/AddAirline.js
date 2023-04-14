import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Row, Col, Modal, Radio, Button, Tabs } from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateAirline } from "../../../actions/AirlineActions";
import InputChosseFile from "../../fileManager/InputChosseFile";

class AddAirline extends Component {
  static propTypes = {
    airline: PropTypes.object,
    onSaveAirline: PropTypes.func,
    open: PropTypes.bool,
    onAirlineClose: PropTypes.func
  };

  static defaultProps = {
    airline: {},
    edit: false,
    open: false
  };

  state = {
    airline: null,
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

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      logo: data[0] ? data[0].path_relative : ""
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.airline && nextProps.airline !== this.props.airline) {
      this.setState({
        ...nextProps,
        logo: nextProps.airline.logo
      });
    }
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
        var airline = {
          ...values,
          logo: this.state.logo
        };
        this.props.onSaveAirline(
          airline,
          this.props.airline ? this.props.airline.id : null
        ).then(res => this.setState({
          logo: ""
        }))
      }
      this.setState({
        airline: null
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
    const { onAirlineClose, open, edit, airline } = this.props;

    const { getFieldDecorator } = this.props.form;

    const { TabPane } = Tabs;

    const dedfaultImage = airline
      ? airline.logo
        ? [{ name: airline.logo, path_relative: airline.logo }]
        : []
      : [];

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="airline.edit" />
              ) : (
                <IntlMessages id="airline.create" />
              )
            }
            visible={open}
            closable={true}
            onCancel={onAirlineClose}
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
                  <Form.Item label={<IntlMessages id="airline.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        { required: true, message: "Please input your title!" }
                      ],
                      initialValue: airline ? airline.title || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="airline.short_title" />}>
                    {getFieldDecorator("short_title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your short title!"
                        }
                      ],
                      initialValue: airline ? airline.short_title || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="airline.code" />}>
                    {getFieldDecorator("code", {
                      rules: [
                        { required: true, message: "Please input your code!" }
                      ],
                      initialValue: airline ? airline.code || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: airline ? (airline.status ? 1 : 0) : 1
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
                  {/* <Form.Item label={<IntlMessages id="airline.signed" />}>
                    {getFieldDecorator("signed", {
                      initialValue: airline ? (airline.signed === 1 ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="airline.signed.yes" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="airline.signed.no" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item> */}
                  <Form.Item label={<IntlMessages id="airline.logo" />}>
                    <InputChosseFile
                      onChange={this.getValueChosseFile}
                      limit={1}
                      defautValue={dedfaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.props.onAirlineClose()}
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

const mapStateToProps = state => {
  return {
    listAirlines: state.airline.listAirlines
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateAirline: data => dispatch(updateAirline(data))
  };
};

const WrappedNormalLoginForm = Form.create({ name: "AddAirline" })(AddAirline);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
