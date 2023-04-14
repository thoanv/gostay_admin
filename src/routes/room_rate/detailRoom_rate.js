import {
    Button,
    Col, Form,
    Input, Modal,
    Row, Timeline
} from "antd";
import moment from "moment";
import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getpropertyRoomRates, removePropertyRateByConditionals, updatepropertyRoomRates } from '../../actions/PropertyAction';
const { confirm } = Modal;
class DetailRoom_rate extends Component {
    submitSingel(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;
                data.id = this.props.focusedEvent.id
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
                        this.props.match.params.id,this.props.month
                    );

                    this.props.onClose();
                });
            } else {
                NotificationManager.error("Please fill out all inputs and try again!");
            }
        });
    }
    onHandleClose = () => {
        this.props.onClose();
    };
    removeRate(date) {
        const component = this;

        confirm({
            title: "Bạn có muốn xóa bản ghi này không?",
            okText: 'Có',
            cancelText: 'Huỷ',
            onOk() {
                var data = {
                    dates: [date],
                    property_id: component.props.match.params.id
                };
                component.props.removePropertyRateByConditionals(data).then(res => {
                    component.props.getpropertyRoomRates(
                        component.props.match.params.id,component.props.month
                    );
                    component.props.onClose();
                })




            },
            onCancel() { }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 9 }
            }
        };
        const { focusedEvent, visible } = this.props

        return (
            <React.Fragment>
                <Modal
                    title= { focusedEvent ? moment(focusedEvent.date).format("DD/MM/YYYY") : ""}
                    visible={visible}
                    footer={null}
                    closable={true}
                    onCancel={this.onHandleClose}
                    width={700}
                >
                    {focusedEvent ? (
                        <React.Fragment>
                            <Form {...formItemLayout}
                                labelAlign='left'
                                onSubmit={e => this.submitSingel(e)}>

                                <Form.Item label={<IntlMessages id="property.price" />}>
                                    {getFieldDecorator("price", {
                                        initialValue: focusedEvent ? focusedEvent.price : 0,
                                        rules: [{ required: false, message: "Please fill out price" }]
                                    })(<Input type="number" suffix="đ" />)}
                                </Form.Item>

                                <Row>
                                    <Col span={4} style={{ textAlign: "left" }}>
                                        <Button
                                            type="danger"
                                            onClick={() => this.removeRate(focusedEvent.date)}
                                        >
                                            <IntlMessages id="global.delete" />
                                        </Button>
                                    </Col>
                                    <Col span={20} style={{ textAlign: "right" }}>
                                        <Button
                                            className="ml-4"
                                            type="default"
                                            onClick={() => this.onHandleClose()}
                                        >
                                            <IntlMessages id="global.cancel" />
                                        </Button>
                                        <Button
                                            type="primary"
                                            style={{ marginLeft: 8 }}
                                            htmlType='submit'
                                            loading={this.props.loading}
                                        >
                                            <IntlMessages id="global.submit" />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>


                        </React.Fragment>
                    ) : null}
                </Modal>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getpropertyRoomRates:  (id,month) => dispatch(getpropertyRoomRates (id,month)),
        updatepropertyRoomRates: data => dispatch(updatepropertyRoomRates(data)),
        removePropertyRateByConditionals: data =>
            dispatch(removePropertyRateByConditionals(data))
    };
}
export default withRouter(
    connect(null, mapDispatchToProps)(Form.create('detail')(DetailRoom_rate))
);