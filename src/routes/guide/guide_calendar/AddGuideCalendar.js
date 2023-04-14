import { Button, Col, Form, Modal, DatePicker, Row, Radio, Tabs } from "antd";
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

class AddGuide extends Component {
  static propTypes = {
    guideCalendar: PropTypes.object,
    onSaveAccount: PropTypes.func,
    open: PropTypes.bool,
    onAccountClose: PropTypes.func
  };

  static defaultProps = {
    edit: false,
    open: false
  };

  state = {
    guideCalendar: null,
    country_id: 0,
    days: 0,
    tour_id: 0,
    listDes: [],
    dest_id: 0,
    filterAll: {
      paging: 0
    }
  };

  getTourCountry = id => {
    let filter = this.props.listTour.find(item => {
      return item.id === id;
    });

    if (filter) {
      this.props.getItineraries(this.state.filterAll, filter.id).then(res => {
        this.setState({
          listDes: res.data.list
        });
      });
    }

    this.setState({
      ...this.state,
      country_id: filter.country_id,
      days: filter.days,
      tour_id: filter.id,
      dest_id: ""
    });

    return filter;
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    let current_tour_id = nextProps.guideCalendar
      ? nextProps.guideCalendar.tour_id
      : 0;
    if (nextProps && nextProps.guideCalendar !== this.props.guideCalendar) {
      this.setState({
        ...nextState,
        tour_id: nextProps.guideCalendar ? nextProps.guideCalendar.tour_id : 0,
        dest_id: nextProps.guideCalendar ? +nextProps.guideCalendar.dest_ids : 0
      });
      if (current_tour_id) {
        this.props
          .getItineraries(this.state.filterAll, nextProps.guideCalendar.tour_id)
          .then(res => {
            this.setState({
              ...nextState,
              listDes: res.data.list
            });
          });
      }
    }
  }

  onHandleClose = () => {
    this.setState({
      ...this.state,
      country_id: 0,
      tour_id: 0,
      listDes: [],
      dest_id: ""
    });
    this.props.onGuideCalendarClose();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var guideCalendar = {
          ...values
        };
        this.props.onSaveGuideCalendar(
          guideCalendar,
          this.props.guideCalendar ? this.props.guideCalendar.id : null
        );
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
      this.setState({
        ...this.state,
        country_id: 0,
        tour_id: 0,
        listDes: [],
        dest_id: 0
      });
    });
  };

  check(arr, str) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title.toString() === str.toString()) return 0;
    }
    return 1;
  }

  render() {
    const {
      open,
      listGuide,
      listTour,
      listGit,
      listSupplier,
      guideCalendar,
      edit
    } = this.props;

    const { listDes, dest_id } = this.state;

    const destDefault = guideCalendar ? this.state.dest_id : "";

    const gits = listGit.map(item => {
      return {
        id: item.id,
        title: item.tour_code
      };
    });

    const companies = listSupplier.map(item => {
      return {
        id: item.id,
        title: item.company
      };
    });

    let itineraries = [];

    for (let i = 0; i < listDes.length; i++) {
      if (this.check(itineraries, listDes[i].dest_title)) {
        itineraries.push({
          id: listDes[i].dest_id,
          title: listDes[i].dest_title
        });
      }
    }

    const { getFieldDecorator } = this.props.form;

    const { TabPane } = Tabs;

    var guides = listGuide.map(item => {
      return {
        id: item.id,
        title: `${item.firstname} ${item.lastname}`
      };
    });

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
                <IntlMessages id="account.saveGuide" />
              ) : (
                <IntlMessages id="account.addGuide" />
              )
            }
            onCancel={this.onHandleClose}
            visible={open}
            closable={true}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs
                defaultActiveKey="1"
                onChange={key => this.setState({ activeTab: key })}
                type="card"
              >
                <TabPane tab="Basic" key="basic">
                  <Form.Item label={<IntlMessages id="sidebar.guide" />}>
                    {getFieldDecorator("cid", {
                      rules: [
                        {
                          required: true,
                          message: "Please select guide!"
                        }
                      ],
                      initialValue: guideCalendar ? guideCalendar.cid : ""
                    })(
                      <BaseSelect
                        options={guides}
                        selected={guideCalendar ? guideCalendar.cid : ""}
                        defaultText="Select one..."
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.tour" />}>
                    {getFieldDecorator("tour_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select tour!"
                        }
                      ],
                      initialValue: guideCalendar ? guideCalendar.tour_id : ""
                    })(
                      <BaseSelect
                        options={listTour}
                        selected={guideCalendar ? guideCalendar.tour_id : ""}
                        defaultText="Select one..."
                        showSearch={true}
                        onChange={this.getTourCountry}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="sidebar.git" />}>
                    {getFieldDecorator("git_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select git!"
                        }
                      ],
                      initialValue: guideCalendar ? guideCalendar.git_id : ""
                    })(
                      <BaseSelect
                        options={gits}
                        selected={guideCalendar ? guideCalendar.git_id : ""}
                        defaultText="Select one..."
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="sidebar.supplier" />}>
                    {getFieldDecorator("operator_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select supplier!"
                        }
                      ],
                      initialValue: guideCalendar
                        ? guideCalendar.operator_id
                        : ""
                    })(
                      <BaseSelect
                        options={companies}
                        selected={
                          guideCalendar ? guideCalendar.operator_id : ""
                        }
                        defaultText="Select one..."
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="guide.date" />}>
                    {getFieldDecorator("date", {
                      rules: [
                        {
                          required: true,
                          message: "Please pick a date !"
                        }
                      ],
                      initialValue: guideCalendar
                        ? guideCalendar.date
                          ? moment(guideCalendar.date)
                          : moment()
                        : moment()
                    })(
                      <DatePicker
                        placeholder="Pick date"
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
                        disabledDate={current => {
                          return (
                            current && current < moment().subtract(1, "day")
                          );
                        }}
                      />
                    )}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.destination" />}>
                    {getFieldDecorator("dest_ids", {
                      rules: [
                        {
                          required: true,
                          message: "Please select day!"
                        }
                      ],
                      initialValue: destDefault
                    })(
                      <BaseSelect
                        options={itineraries}
                        selected={destDefault}
                        defaultText="Select one..."
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: guideCalendar
                        ? guideCalendar.status === 1
                          ? 1
                          : guideCalendar.status === 2
                          ? 2
                          : 3
                        : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="guide.status.sent" />
                        </Radio>
                        <Radio value={2}>
                          <IntlMessages id="guide.status.accepted" />
                        </Radio>
                        <Radio value={3}>
                          <IntlMessages id="guide.status.rejected" />
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
                      initialValue:
                        guideCalendar != null ? guideCalendar.content || "" : ""
                    })(
                      <SunEditor
                        setContents={
                          guideCalendar != null
                            ? guideCalendar.content || ""
                            : ""
                        }
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

export default Form.create({ name: "guide" })(
  connect(mapStateToProps, mapDispatchToProps)(AddGuide)
);
