import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Row, Col, Modal, Radio, Button, Tabs } from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { updateCurrency } from "../../../actions/CurrencyAction";
import BaseIntegerList from "Components/Elements/BaseIntegerList";
import BaseCheckBoxList from "Components/Elements/BaseCheckboxes";
import BaseSelect from "Components/Elements/BaseSelect";
import InputChosseFile from "../../fileManager/InputChosseFile";

class AddCurrency extends Component {
  static propTypes = {
    currency: PropTypes.object,
    onSaveCurrency: PropTypes.func,
    open: PropTypes.bool,
    onCurrencyClose: PropTypes.func
  };

  static defaultProps = {
    currency: {},
    edit: false,
    open: false
  };

  state = {
    currency: null,
    value: 1,
    symbol: "",
    image: ""
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

  onChangeSymbol = (name, values) => {
    this.setState({
      symbol: values
    });
  };

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
        var currency = { ...values };
        this.props.onSaveCurrency(
          currency,
          this.props.currency ? this.props.currency.id : null
        );
      }
      this.setState({
        currency: null
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
    const { onCurrencyClose, open, edit, currency } = this.props;

    const { current_currency } = this.state;

    const { getFieldDecorator } = this.props.form;

    const { TabPane } = Tabs;

    const listThousand = [
      { title: ",", id: "," },
      { title: ".", id: "." },
    ]

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
            onCancel={onCurrencyClose}
            closable={true}
            destroyOnClose={true}
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
                  <Form.Item label={<IntlMessages id="currency.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        { required: true, message: "Please input your title!" }
                      ],
                      initialValue: currency ? currency.title || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="currency.currency" />}>
                    {getFieldDecorator("name", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your name!"
                        }
                      ],
                      initialValue: currency ? currency.name || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="currency.exchange_rate" />}>
                    {getFieldDecorator("exchange_rate", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your exchange rate!"
                        }
                      ],
                      initialValue: currency ? currency.exchange_rate || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="currency.thousand" />}>
                    {getFieldDecorator("thousand", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your thousand!"
                        }
                      ],
                      initialValue: currency ? currency.thousand || "" : ""
                    })(
                        <BaseSelect
                        options={listThousand}
                        defaultText="Select one..."
                        selected={currency ? currency.thousand : ""}
                        onChange={value => {console.log(value);
                        }}
                        />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="currency.symbol" />}>
                    {getFieldDecorator("symbol", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your symbol!"
                        }
                      ],
                      initialValue: currency ? currency.symbol : ""
                    })(
                      <Input style={{ width: "100%" }} />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="currency.display" />}>
                      {getFieldDecorator("display", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your display!"
                          }
                        ],
                        initialValue: currency ? currency.display : ""
                      })(
                        <Input style={{ width: "100%" }} />
                      )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: currency ? (currency.status ? 1 : 0) : 1
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
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="default"
                    onClick={() => this.props.onCurrencyClose()}
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
    listCurrency: state.currency.listCurrency
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCurrency: data => dispatch(updateCurrency(data))
  };
};

const WrappedNormalLoginForm = Form.create({ name: "AddCurrency" })(
  AddCurrency
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
