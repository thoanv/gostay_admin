import {
  Button,
  Col,
  Form,
  Modal,
  DatePicker,
  Row,
  Radio,
  Tabs,
  InputNumber
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getItineraries } from "../../../actions/ItineraryAction";
import { NotificationManager } from "react-notifications";
import BaseSelect from "Components/Elements/BaseSelect";
import moment from "moment";
import SunEditor, { buttonList } from "suneditor-react";

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

class AddGit extends Component {
  static propTypes = {
    git: PropTypes.object,
    open: PropTypes.bool
  };

  static defaultProps = {
    edit: false,
    open: false
  };

  state = {
    git: null,
    country_id: 0,
    start: moment(),
    tour_id: 0,
    filterAll: {
      paging: 0
    }
  };

  onChange = event => {
    this.setState({
      ...this.state,
      start: moment(event).format("YYYY-MM-DD")
    });
  };

  onHandleClose = () => {
    this.setState({
      ...this.state,
      country_id: 0,
      tour_id: 0,
      listDes: [],
      start: moment()
    });
    this.props.onGitClose();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var git = {
          ...values
        };
        this.props.onSaveGit(git, this.props.git ? this.props.git.id : null);
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
      this.setState({
        ...this.state,
        start: moment()
      });
    });
  };

  check(arr, str) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id.toString() === str.toString()) return 0;
    }
    return 1;
  }

  render() {
    const { open, listTour, git, edit } = this.props;

    const { start } = this.state;

    const tourCode = [];

    for (let i = 0; i < listTour.length; i++) {
      if (this.check(tourCode, listTour[i].code)) {
        tourCode.push({
          id: listTour[i].code,
          title: `(${listTour[i].code}) - ${listTour[i].title}`
        });
      }
    }

    const start_date = git
      ? git.start_date
        ? moment(git.start_date)
        : moment()
      : moment();

    const end_date = git
      ? git.end_date
        ? moment(git.end_date)
        : moment().add(1, "day")
      : moment().add(1, "day");

    const { getFieldDecorator } = this.props.form;

    const { TabPane } = Tabs;

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
            onCancel={this.onHandleClose}
            visible={open}
            closable={true}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Basic" key="basic">
                  <Form.Item label={<IntlMessages id="git.tour_code" />}>
                    {getFieldDecorator("tour_code", {
                      rules: [
                        {
                          required: true,
                          message: "Please select tour code!"
                        }
                      ],
                      initialValue: git ? git.tour_code : ""
                    })(
                      <BaseSelect
                        options={tourCode}
                        selected={git ? git.tour_code : ""}
                        defaultText="Select one..."
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="git.start_date" />}>
                    {getFieldDecorator("start_date", {
                      rules: [
                        {
                          required: true,
                          message: "Please pick a date !"
                        }
                      ],
                      initialValue: start_date
                    })(
                      <DatePicker
                        placeholder="Pick start date"
                        style={{ width: "100%" }}
                        onChange={this.onChange}
                        disabledDate={current => {
                          return current && current < moment();
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="git.end_date" />}>
                    {getFieldDecorator("end_date", {
                      rules: [
                        {
                          required: true,
                          message: "Please pick a date !"
                        }
                      ],
                      initialValue: end_date
                    })(
                      <DatePicker
                        placeholder="Pick end date"
                        style={{ width: "100%" }}
                        disabledDate={current => {
                          return (
                            current && current < moment(start).add(1, "day")
                          );
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="git.qty" />}>
                    {getFieldDecorator("qty", {
                      rules: [
                        {
                          required: true,
                          message: "Please input quantity !"
                        }
                      ],
                      initialValue: git ? git.qty : 0
                    })(<InputNumber min={0} style={{ width: "50%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: git ? (git.status === 1 ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={0}>
                          <IntlMessages id="global.unpublish" />
                        </Radio>
                        <Radio value={1}>
                          <IntlMessages id="global.publish" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Content" key="content">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("content", {
                      rules: [
                        {
                          required: true,
                          message: "Please input yicket content!"
                        }
                      ],
                      initialValue: git != null ? git.content || "" : ""
                    })(
                      <SunEditor
                        setContents={git ? git.content : ""}
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
                    onClick={this.onHandleClose}
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
    listItinerary: state.itinerary.listItinerary
  };
};
function mapDispatchToProps(dispatch) {
  return {
    getItineraries: (filter, id) => dispatch(getItineraries(filter, id))
  };
}

export default Form.create({ name: "git" })(
  connect(mapStateToProps, mapDispatchToProps)(AddGit)
);
