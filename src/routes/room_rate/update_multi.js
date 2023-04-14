import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
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
import moment from "moment";
import IntlMessages from "Util/IntlMessages";
import { getpropertyRoomRates, updatemultipropertyRoomRates } from '../../actions/PropertyAction';
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
class Update_multi extends Component {
    state = {
        selectedDays: [],
        currentMonth: moment().month()+1 ,
    };
    onHandleClose = () => {
        this.props.onClose();
        this.setState({
            selectedDays: [],
        })
    };
    handleUpdate(e) {
        e.preventDefault();
        const component = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;
                var dates = component.state.selectedDays.map(item =>
                    moment(item).format("YYYY-MM-DD")
                );
                data.dates = dates
                data.property_id = component.props.match.params.id
                component.props.updatemultipropertyRoomRates(data).then(res => {
                    component.setState({
                        selectedDays: [],
                    })
                   
                    component.props.getpropertyRoomRates(
                        component.props.match.params.id,component.props.currentMonth 
                    );
                    component.props.form.resetFields();
                    component.props.onClose();
                });
            } else {
                NotificationManager.error("Please fill out all inputs and try again!");
            }
        });
    }
    handleDayClick = (day, { selected }) => {
        const { selectedDays } = this.state;
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            selectedDays.splice(selectedIndex, 1);
        } else {
            selectedDays.push(day);
        }
        this.setState({

            ...this.state,
            selectedDays: selectedDays

        });
    };
    handleChangeMonth=(date)=>{
        let nextMonth = moment(date).month() +1;
        
       
        if (
            nextMonth != this.state.currentMonth 
          
        ) {
            this.setState(
                {
                    currentMonth: nextMonth,
                  
                },
                () => {
                    this.props.getpropertyRoomRates(
                        this.props.match.params.id,this.state.currentMonth
                    );
                }
            );
        }
    }
    render() {

        const { visible, events } = this.props
        const { getFieldDecorator } = this.props.form;
        var startDate = events && events[0] ? events[0].date : moment();
        var endDate = events && events[events.length - 1] ? events[events.length - 1].date : moment();

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

        return (
            <React.Fragment>
                <Modal
                    title={<IntlMessages id="global.update" />}
                    visible={visible}
                    closable={true}
                    onCancel={this.onHandleClose}
                    footer={null}
                    style={{ minWidth: "700px" }}
                >
                    <Form {...formItemLayout}
                        labelAlign='left'
                        onSubmit={e => this.handleUpdate(e)}>

                        <Form.Item label={<IntlMessages id="global.calendar" />}>
                            <DayPicker
                            onMonthChange={this.handleChangeMonth}
                                selectedDays={this.state.selectedDays}
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
                        <Form.Item label={<IntlMessages id="property.price" />}>
                            {getFieldDecorator("price", {
                                initialValue: 0,
                                rules: [{ required: false, message: "Please fill out price" }]
                            })(<Input type="number" suffix="đ" />)}
                        </Form.Item>
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    className="ml-4"
                                    type="default"
                                    onClick={() => this.onHandleClose()}
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
            </React.Fragment>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getpropertyRoomRates:  (id ,month) => dispatch(getpropertyRoomRates (id,month )),
        updatemultipropertyRoomRates: data => dispatch(updatemultipropertyRoomRates(data)),

    }
}
export default withRouter(
    connect(null, mapDispatchToProps)(Form.create('update')(Update_multi))
);