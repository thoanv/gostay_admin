import {
    Button,
    Col, DatePicker, Form,
    Input, Modal,
    Row, Tabs
} from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import moment from "moment";
import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { NotificationManager } from "react-notifications";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { addpropertyRoomRates, getpropertyRoomRates, removePropertyRateByConditionals, updatepropertyRoomRates ,_getDetail} from "../../actions/PropertyAction";
import DetailRoom_rate from "./detailRoom_rate";
import Update_multi from "./update_multi";
// actions

const { TabPane } = Tabs;

const { confirm } = Modal;

moment.locale("en-GB");
BigCalendar.momentLocalizer(moment);

const CustomEventComponent = ({ event }) => {

    let prices = event.property.map((e, index) => {
        return {
            price: e.price,
            status: e.status
        }
    });
    if (prices[0].status === 0) {


        return <div style={{ textAlign: 'center', height: '48px', backgroundColor: '#e11a1a' }}>

            <NumberFormat value={prices[0].price} thousandSeparator="." decimalSeparator=',' displayType="text" suffix={'đ'} />
        </div>;
    }
    return <div style={{ textAlign: 'center' }}>
        <NumberFormat value={prices[0].price} thousandSeparator="." decimalSeparator=',' displayType="text" suffix={'đ'}/>
    </div>;
};

class Room_rate extends Component {
    state = {
        visible: false,
        focusedEvent: null,
        currentMonth: moment().month() + 1,
        currentYear: moment().year(),
        isOpenCreateModal: false,
        isOpenUpdateModal: false,
        isOpenRemoveModal: false,
        selectedDays: [],
        currentRate: {
            selectedDays: [],
            startdate: moment()
        },
        removeConditionals: {
            selectedDays: [],
        }
    };

    componentDidMount() {

        this.props.getpropertyRoomRates(
            this.props.match.params.id, this.state.currentMonth,this.state.currentYear
        );
        this.props._getDetailProperty(this.props.match.params.id)
    }

    onClickEvent(event) {

        this.setState({
            visible: true,
            focusedEvent: event.property[0]
        });
    }

    onCloseModal() {
        this.setState({
            visible: false,
            focusedEvent: null,
            isOpenUpdateModal: false,
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
                    this.props.getpropertyRoomRates(
                        this.props.match.params.id, this.state.currentMonth,this.state.currentYear
                    );
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
    submitSingel(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;
                data.id = this.state.focusedEvent.id
                this.props.updatepropertyRoomRates(data).then(res => {

                    this.props.form.resetFields();
                    this.setState({
                        selectedDays: [],
                        currentRate: {
                            selectedDays: [],
                            startdate: moment()
                        }
                    });

                    this.props.getpropertyRoomRates(
                        this.props.match.params.id, this.state.currentMonth,this.state.currentYear
                    );

                    this.onCloseModal();
                });
            } else {
                NotificationManager.error("Please fill out all inputs and try again!");
            }
        });
    }
    submit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;

                data.startdate = data.startdate.format("YYYY-MM-DD");
                data.enddate = data.enddate.format("YYYY-MM-DD");
                data.property_id = parseInt(this.props.match.params.id);

                this.props.addpropertyRoomRates(data).then(res => {

                    this.props.form.resetFields();
                    this.setState({
                        selectedDays: [],
                        currentRate: {
                            selectedDays: [],
                            startdate: moment()
                        }
                    });

                    this.props.getpropertyRoomRates(
                        this.props.match.params.id, this.state.currentMonth,this.state.currentYear
                    );

                    this.onCloseModal();
                });
            } else {
                NotificationManager.error("Please fill out all inputs and try again!");
            }
        });
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
            title: "Bạn có muốn xóa các bản ghi này không?",
            okText: 'Có',
            okType: 'danger',
            onOk() {
                var dates = component.state.removeConditionals.selectedDays.map(item =>
                    moment(item).format("YYYY-MM-DD")
                );
                var data = {
                    dates: dates,
                    property_id: component.props.match.params.id
                };
                component.props.removeRateByConditionals(data).then(res => {
                    component.props.getpropertyRoomRates(
                        component.props.match.params.id,component.state.currentMonth,this.state.currentYear
                    );
                    component.setState({
                        removeConditionals: {
                            ...component.state.removeConditionals,
                            selectedDays: []
                        }
                    })
                    component.onCloseModal();
                    component.props.form.resetFields();
                  
                }
                )

            },
            onCancel() { }
        });
    }

    render() {
        var { focusedEvent, currentRate, currentMonth } = this.state;
        var { rates ,detailProperty} = this.props;
        console.log('rates', detailProperty);
        var startDate = rates && rates[0] ? rates[0].date : moment();
        var endDate = rates && rates[rates.length - 1] ? rates[rates.length - 1].date : moment();
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
                {/* {rates.length ? (
                    <h2>

                        {<IntlMessages id="sidebar.calendar_for_property" />}

                    </h2>
                ) : null} */}
                <div>
                    <Button
                        icon="plus"
                        type="primary"
                        style={{ marginRight: '10px' }}
                        onClick={() => this.setState({ isOpenCreateModal: true })}
                    >
                        <IntlMessages id="global.create" />
                    </Button>
                    {
                        rates.length ?
                            <React.Fragment>


                                <Button
                                    icon="edit"
                                    type="primary"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => this.setState({ isOpenUpdateModal: true })}
                                >
                                    <IntlMessages id="global.update" />
                                </Button>
                                <Button
                                    icon="delete"
                                    type="danger"
                                    onClick={() => this.setState({ isOpenRemoveModal: true })}
                                >
                                    <IntlMessages id="global.delete" />
                                </Button>
                            </React.Fragment>

                            :
                            null
                    }



                </div>
                <div className="mt-4">
                    <BigCalendar
                        popup
                        events={events}

                        defaultDate={new Date()}

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

                <DetailRoom_rate
                    visible={this.state.visible}
                    focusedEvent={focusedEvent}
                    onClose={() => this.onCloseModal()}
                    month={currentMonth}
                />
                <Update_multi
                    visible={this.state.isOpenUpdateModal}
                    events={events}
                    onClose={() => this.onCloseModal()}
                    currentMonth={currentMonth}
                />
                <Modal
                    title={<IntlMessages id="global.create" />}
                    visible={this.state.isOpenCreateModal}
                    onCancel={() => this.onCloseModal()}
                    footer={null}
                    style={{ minWidth: "800px" }}
                >
                    <Form {...formItemLayout}
                        labelAlign='left'
                        onSubmit={e => this.submit(e)}>
                        <Form.Item label={<IntlMessages id="global.months" />}>
                            {getFieldDecorator("months", {

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

                        <Form.Item label={<IntlMessages id="property.start_date" />}>
                            {getFieldDecorator("startdate", {
                                initialValue: currentRate ? currentRate.startdate : "",
                                rules: [
                                    { required: true, message: "Please fill out start date!" }
                                ]
                            })(<DatePicker />)}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="property.end_date" />}>
                            {getFieldDecorator("enddate", {
                                initialValue: currentRate ? currentRate.enddate : "",
                                rules: [
                                    { required: true, message: "Please fill out end date!" }
                                ]
                            })(<DatePicker />)}
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="property.price_week" />}>
                            {getFieldDecorator("price_week", {
                                initialValue: detailProperty ? detailProperty.price : 0,
                                rules: [{ required: true, message: "Please fill out price week!" }]
                            })(<Input type="number" suffix="đ" />)}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="property.price_weekend" />}>
                            {getFieldDecorator("price_weekend", {
                                initialValue: detailProperty ? detailProperty.weekend_price : 0,
                                rules: [{ required: true, message: "Please fill out price weekend!" }]
                            })(<Input type="number" suffix="đ" />)}
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
                    style={{ minWidth: "700px" }}
                >
                    <Form {...formItemLayout}
                        labelAlign='left'
                        onSubmit={e => this.handleRemove(e)}>

                        <Form.Item label={<IntlMessages id="global.calendar" />}>
                            <DayPicker
                                selectedDays={this.state.removeConditionals.selectedDays}
                                onDayClick={this.handleDayClick}
                                month={new Date(moment(startDate))}
                                fromMonth={new Date(moment(startDate).month())}
                                toMonth={new Date(moment(endDate).month())}
                                disabledDays={{
                                    before: new Date(moment(startDate)),
                                    after: new Date(moment(endDate)),
                                }}
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
        rates: state.property.listRoomRates,
        detailProperty:state.property.detail
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getpropertyRoomRates: (id, month,year) => dispatch(getpropertyRoomRates(id, month,year)),
        addpropertyRoomRates: data => dispatch(addpropertyRoomRates(data)),
        updatepropertyRoomRates: data => dispatch(updatepropertyRoomRates(data)),
        _getDetailProperty :(id) => dispatch(_getDetail(id)),
        removeRateByConditionals: data =>
            dispatch(removePropertyRateByConditionals(data))
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Form.create()(Room_rate))
);
