import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Modal,
  Button,
  Timeline,
  Tabs,
  Form,
  DatePicker,
  Input,
  Row,
  Col,
  Checkbox
} from "antd";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import BaseSelect from "Components/Elements/BaseSelect";
import { withRouter } from "react-router-dom";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
// actions
import {
  getTourRates,
  getDeparturesOfTour,
  addTourRates,
  removeTourRate,
  removeTourRateByConditionals
} from "../../actions/TourActions";
const { TabPane } = Tabs;

const { confirm } = Modal;

moment.locale("en-GB");
BigCalendar.momentLocalizer(moment);

const CustomEventComponent = ({ event }) => {

  let departures = event.tour_options.map(option => {
    return option.destination_title;
  });


  let title = departures.join(", ");

  if (title.length > 80) {
    title = title.substr(0, 80) + "...";
  }

  return <div>{title}</div>;
};

class Calendar extends Component {
  state = {
    visible: false,
    focusedEvent: null,
    currentMonth: moment().month() + 1,
    currentYear: moment().year(),
    isOpenCreateModal: false,
    isOpenRemoveModal: false,
    selectedDays: [],
    currentRate: {
      selectedDays: [],
      startdate: moment()
    },
    removeConditionals: {
      selectedDays: [],
      departure: null
    }
  };

  componentDidMount() {
    this.props.getTourRates({
      tour_id: this.props.match.params.id
    });

    this.props.getDeparturesOfTour(this.props.match.params.id);
  }

  onClickEvent(event) {
    this.setState({
      visible: true,
      focusedEvent: event
    });
  }

  onCloseModal() {
    this.setState({
      visible: false,
      focusedEvent: null,
      isOpenCreateModal: false,
      isOpenRemoveModal: false,
      currentRate: {
        selectedDays: [],
        startdate: moment()
      }
    });
  }

  onChangeDate(date) {
    let nextMonth = moment(date).month() + 1;
    let nextYear = moment(date).year();

    if (
      nextMonth != this.state.currentMonth ||
      nextYear != this.state.currentyear
    ) {
      this.setState(
        {
          currentMonth: nextMonth,
          currentYear: nextYear
        },
        () => {
          this.props.getTourRates({
            tour_id: this.props.match.params.id,
            month: this.state.currentMonth,
            year: this.state.currentYear
          });
        }
      );
    }
  }

  handleDayClick = (day, { selected }) => {
    const { selectedDays } = this.state.removeConditionals;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({
      removeConditionals: {
        ...this.state.removeConditionals,
        selectedDays: selectedDays
      }
    });
  };

  selectDates(dates) {
    this.setState({
      isOpenCreateModal: true,
      currentRate: {
        selectedDays: [],
        startdate: moment(dates[0]),
        enddate: moment(dates[dates.length - 1])
      }
    });
  }

  submit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = values;
        // data.date = moment(data.date).format("YYYY-MM-DD");
        // data.date = data.date.map(item => moment(item).format("YYYY-MM-DD"));
        data.startdate = data.startdate.format("YYYY-MM-DD");
        data.enddate = data.enddate.format("YYYY-MM-DD");
        data.tour_id = parseInt(this.props.match.params.id);

        this.props.addTourRates(data).then(() => {
          this.props.form.resetFields();
          this.setState({
            selectedDays: [],
            currentRate: {
              selectedDays: [],
              startdate: moment()
            }
          });

          this.props.getTourRates({
            tour_id: this.props.match.params.id,
            month: this.state.currentMonth,
            year: this.state.currentYear
          });

          this.onCloseModal();
        });
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
    });
  }

  removeRate(id) {
    const component = this;

    confirm({
      title: "Bạn có muốn xóa bản ghi này không?",
      cancelText: "Huỷ",
      okText: "OK",
      okType: 'danger',
      onOk() {
        component.props.removeTourRate(id).then(() => {
          let temp = component.state.focusedEvent;
          temp.tour_options = temp.tour_options.filter(option => {
            return parseInt(option.id) != parseInt(id);
          });

          component.setState({
            focusedEvent: temp
          });

          component.props.getTourRates({
            tour_id: component.props.match.params.id,
            month: component.state.currentMonth,
            year: component.state.currentYear
          });
        });
      },
      onCancel() { }
    });
  }

  copyRate(option) {
    this.setState(
      {
        currentRate: {
          ...option,
          selectedDays: [new Date(option.date)]
        },
        isOpenCreateModal: true,
        visible: false
      },
      () => {
        console.log(this.state.currentRate);
      }
    );
  }

  onChangeMonth(value) {
    this.setState({
      currentRate: {
        ...this.state.currentRate,
        enddate: moment(this.state.currentRate.startdate).add(value, "months")
      }
    });
  }

  onChangeRemoveForm(name, value) {
    this.setState({
      removeConditionals: {
        ...this.state.removeConditionals,
        [name]: value
      }
    });
  }

  handleRemove(e) {
    e.preventDefault();
    const component = this;
    confirm({
      title: "Bạn có muốn xóa những bản ghi thoả mãn theo điều kiện này không?",
      cancelText: "Huỷ",
      okText: "OK",
      okType: 'danger',
      onOk() {
        var dates = component.state.removeConditionals.selectedDays.map(item =>
          moment(item).format("YYYY-MM-DD")
        );
        var data = {
          dates: dates,
          tour_id: component.props.match.params.id,
          option_id: component.state.removeConditionals.option_id
        };
        component.props.removeTourRateByConditionals(data);

        component.props.getTourRates({
          tour_id: component.props.match.params.id,
          month: component.state.currentMonth,
          year: component.state.currentYear
        });
      },
      onCancel() { }
    });
  }

  render() {
    var { focusedEvent, currentRate } = this.state;
    var { rates, departures } = this.props;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    var events = rates.map(rate => {
      return {
        // id: rate.id,
        // title: rate.date,
        start: new Date(rate.date),
        end: new Date(rate.date),
        ...rate
      };
    });

    var months = [];
    for (let i = 1; i <= 24; i++) {
      months.push({ id: i, title: i });
    }

    var daysOfWeek = [
      { label: "Mon", value: 1 },
      { label: "Tue", value: 2 },
      { label: "Wed", value: 3 },
      { label: "Thu", value: 4 },
      { label: "Fri", value: 5 },
      { label: "Sat", value: 6 },
      { label: "Sun", value: 7 }
    ];

    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.calendar" />}
          match={this.props.match}
        />
        {rates.length ? (
          <h2>
            Calendar for Tour
            {/* {rates[0].tour_options[0].tour_title} */}
          </h2>
        ) : null}
        <div>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.setState({ isOpenCreateModal: true })}
          >
            <IntlMessages id="global.create" />
          </Button>
          <Button
            icon="delete"
            type="danger"
            onClick={() => this.setState({ isOpenRemoveModal: true })}
          >
            <IntlMessages id="global.delete" />
          </Button>
        </div>
        <div className="mt-4">
          <BigCalendar
            popup
            events={events}
            // step={60}
            // view='month'
            // views={['month']}
            defaultDate={new Date()}
            // min={new Date(2015, 0, 1, 8, 0)} // 8.00 AM
            // max={new Date(2008, 0, 1, 17, 0)} // Max will be 6.00 PM!
            // date={new Date(2018, 0, 1)}
            onView={() => { }}
            onNavigate={value => this.onChangeDate(value)}
            onSelectEvent={event => this.onClickEvent(event)}
            components={{
              event: CustomEventComponent
            }}
            selectable={true}
            onSelectSlot={data => this.selectDates(data.slots)}
          />
        </div>

        <Modal
          title={<IntlMessages id="calendar.modal_title" />}
          visible={this.state.visible}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => this.onCloseModal()}
            >
              OK
            </Button>
          ]}
          closable={false}
          width={1000}
        >
          {focusedEvent ? (
            <Tabs defaultActiveKey="0">
              {focusedEvent.tour_options.map((option, index) => {
                return (
                  <TabPane
                    tab={option.destination_title}
                    key={index.toString()}
                  >
                    <Timeline>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.tour_id" />:{" "}
                        </b>
                        {option.option_id}
                      </Timeline.Item>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.tour_title" />:{" "}
                        </b>
                        {option.tour_title}
                      </Timeline.Item>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.date" />:{" "}
                        </b>
                        {moment(option.date).format("DD/MM/YYYY")}
                      </Timeline.Item>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.seat" />:{" "}
                        </b>
                        {option.seat}
                      </Timeline.Item>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.booked_seat" />:{" "}
                        </b>
                        {option.seated}
                      </Timeline.Item>
                      <Timeline.Item>
                        <b>
                          <IntlMessages id="calendar.modal.price" />:{" "}
                        </b>
                        {option.price} $
                      </Timeline.Item>
                    </Timeline>

                    <Button
                      type="default"
                      icon="copy"
                      onClick={() => this.copyRate(option)}
                    >
                      <IntlMessages id="global.copy" />
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => this.removeRate(option.id)}
                    >
                      <IntlMessages id="global.delete" />
                    </Button>
                  </TabPane>
                );
              })}
            </Tabs>
          ) : null}
        </Modal>
        <Modal
          title={<IntlMessages id="global.create" />}
          visible={this.state.isOpenCreateModal}
          onCancel={() => this.onCloseModal()}
          footer={null}
          style={{ minWidth: "800px" }}
        >
          <Form {...formItemLayout} onSubmit={e => this.submit(e)}>
            <Form.Item label={<IntlMessages id="tour.departures" />}>
              {getFieldDecorator("option_id", {
                initialValue: currentRate ? currentRate.option_id : "",
                rules: [
                  { required: true, message: "Please choose one departure!" }
                ]
              })(
                <BaseSelect
                  defaultText="Select departure"
                  options={departures}
                  optionValue="option_id"
                  optionLabel="destination_title"
                  style={{ minWidth: "200px" }}
                />
              )}
            </Form.Item>
            <Form.Item label={<IntlMessages id="tour.days_of_week" />}>
              {getFieldDecorator("weekdays", {
                // initialValue: currentRate ? (currentRate.months ? 1 : 0) : 0,
                rules: [
                  { required: true, message: "Please choose days of week!" }
                ]
              })(<Checkbox.Group options={daysOfWeek} />)}
            </Form.Item>
            <Form.Item label={<IntlMessages id="tour.months" />}>
              {getFieldDecorator("months", {
                // initialValue: currentRate ? (currentRate.months ? 1 : 0) : 0,
                rules: [
                  {
                    required: false,
                    message: "Please choose number of months!"
                  }
                ]
              })(
                <BaseSelect
                  defaultText="Select months"
                  options={months}
                  style={{ minWidth: "200px" }}
                  onChange={value => this.onChangeMonth(value)}
                />
              )}
            </Form.Item>
            {/* <Row>
                            <Col span={24}>
                                <Form.Item label={<IntlMessages id="global.date" />}>
                                    {
                                        getFieldDecorator("date", {
                                            // initialValue: currentTour ? (currentTour.featured ? 1 : 0) : 0
                                            rules: [
                                                { required: true, message: "Please choose date!" }
                                            ],
                                        })(
                                            // <DatePicker placeholder="Select date" style={{ width: '100%' }} /> 
                                            <DayPicker
                                                selectedDays={currentRate.selectedDays}
                                                onDayClick={this.handleDayClick}
                                            />
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row> */}
            <Form.Item label={<IntlMessages id="tour.start_date" />}>
              {getFieldDecorator("startdate", {
                initialValue: currentRate ? currentRate.startdate : "",
                rules: [
                  { required: true, message: "Please fill out start date!" }
                ]
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item label={<IntlMessages id="tour.end_date" />}>
              {getFieldDecorator("enddate", {
                initialValue: currentRate ? currentRate.enddate : "",
                rules: [
                  { required: true, message: "Please fill out end date!" }
                ]
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item label={<IntlMessages id="global.seat" />}>
              {getFieldDecorator("seat", {
                initialValue: currentRate ? currentRate.seat : 0,
                rules: [{ required: true, message: "Please fill out seat!" }]
              })(<Input type="number" />)}
            </Form.Item>
            <Form.Item label={<IntlMessages id="global.price" />}>
              {getFieldDecorator("price", {
                initialValue: currentRate ? currentRate.price : 0,
                rules: [{ required: true, message: "Please fill out price!" }]
              })(<Input type="number" suffix="$" />)}
            </Form.Item>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  className="ml-4"
                  type="default"
                  onClick={() => this.onCloseModal()}
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
        <Modal
          title={<IntlMessages id="global.delete" />}
          visible={this.state.isOpenRemoveModal}
          onCancel={() => this.onCloseModal()}
          footer={null}
          style={{ minWidth: "800px" }}
        >
          <Form {...formItemLayout} onSubmit={e => this.handleRemove(e)}>
            <Form.Item label={<IntlMessages id="tour.departures" />}>
              <BaseSelect
                defaultText="Select departure"
                options={departures}
                optionValue="option_id"
                optionLabel="destination_title"
                style={{ minWidth: "200px" }}
                onChange={value => this.onChangeRemoveForm("option_id", value)}
              />
            </Form.Item>
            <Form.Item label={<IntlMessages id="tour.calendar" />}>
              <DayPicker
                selectedDays={this.state.removeConditionals.selectedDays}
                onDayClick={this.handleDayClick}
              />
            </Form.Item>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  className="ml-4"
                  type="default"
                  onClick={() => this.onCloseModal()}
                >
                  <IntlMessages id="global.cancel" />
                </Button>
                <Button
                  type="danger"
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rates: state.tour.listRates,
    departures: state.tour.departures
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTourRates: filter => dispatch(getTourRates(filter)),
    getDeparturesOfTour: tour_id => dispatch(getDeparturesOfTour(tour_id)),
    addTourRates: data => dispatch(addTourRates(data)),
    removeTourRate: id => dispatch(removeTourRate(id)),
    removeTourRateByConditionals: data =>
      dispatch(removeTourRateByConditionals(data))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Form.create()(Calendar))
);
