import { Button, Col, Form, Input, InputNumber, Modal, Row, DatePicker } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import moment from 'moment'
import InputChosseFile from "../fileManager/InputChosseFile";


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

const typeOption = [
    { title: "Percent", id: "1" },
    { title: "Number", id: "2" },
];

const styleOption = [
    { title: "Normal", id: "1" },
    { title: "Additional of admin", id: "2" },
]

const statusOption = [
    { title: "Active", id: "1" },
    { title: "Inactive", id: "2" },
]


class Add extends Component {

    static propTypes = {
        record: PropTypes.object,
        onSave: PropTypes.func,
        open: PropTypes.bool,
        onClose: PropTypes.func
    };

    static defaultProps = {
        record: {
        },
        edit: false,
        open: false
    };

    state = {
        record: null,
        image: ""

    };

    componentDidMount() {
        this.setState({
            ...this.state,
            record: this.props.record
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.record !== state.record) {
            return {
                ...state,
                record: props.record
            };
        }
        return null;
    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var record = {
                    ...values,
                    start_date: values.start_date.format("YYYY-MM-DD HH:mm:ss"),
                    start_buy: values.start_buy.format("YYYY-MM-DD HH:mm:ss"),
                    end_date: values.end_date.format("YYYY-MM-DD HH:mm:ss"),
                    end_buy: values.end_buy.format("YYYY-MM-DD HH:mm:ss"),
                    image: this.state.image,
                    type: 1,
                    style: 1
                };

                this.props.onSave(
                    record,
                    this.props.record ? this.props.record.id : null
                )
            }
        });
    };


    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };


    render() {
        const {
            onClose,
            open,
            record,
            edit,
            isSubmiting
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const dedfaultImage = record && record.image ? [{ name: record.image, path_relative: record.image }] : [];
        console.log("dedfaultImage", dedfaultImage)
        return (
            <React.Fragment>
                <Modal
                    title={
                        edit ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.create" />
                    }
                    toggle={onClose}
                    visible={open}
                    destroyOnClose={true}
                    closable={true}
                    onCancel={() => this.props.onClose()}
                    footer={null}
                    width="50%"
                    centered
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label={<IntlMessages id="global.title" />}>
                            {getFieldDecorator("title", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input title"
                                    }
                                ],
                                initialValue: record && record.title ? record.title : null
                            })(
                                <Input placeholder="Title of promotion" />
                            )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="global.description" />}>
                            {getFieldDecorator("description", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input description"
                                    }
                                ],
                                initialValue: record && record.description ? record.description : null
                            })(
                                <Input placeholder="Description of promotion" />
                            )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="promotion.amount" />} >
                            {getFieldDecorator("amount", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input amount"
                                    }
                                ],
                                initialValue: record && record.amount ? record.amount : null
                            })(
                                <InputNumber style={{ width: "100%" }} placeholder="Amount of promotion" formatter={value => `${value}%`} />
                            )}
                        </Form.Item>
                        {/* <Form.Item label={<IntlMessages id="global.type" />}>
                            {getFieldDecorator("type", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select type of promotion"
                                    }
                                ],
                                initialValue: record ? record.type ? record.type.toString() : "1" : "1"
                            })(
                                <BaseSelect
                                    showSearch
                                    options={typeOption}
                                    selected={record ? record.type ? record.type.toString() : "1" : "1"}
                                // onChange={value => console.log(value)}
                                />
                            )}
                        </Form.Item> */}

                        {/* <Form.Item label={<IntlMessages id="promotion.style" />}>
                            {getFieldDecorator("style", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select style of promotion"
                                    }
                                ],
                                initialValue: record ? record.style ? record.style.toString() : "1" : "1"
                            })(
                                <BaseSelect
                                    showSearch
                                    options={styleOption}
                                    selected={record ? record.style ? record.style.toString() : "1" : "1"}
                                // onChange={value => console.log(value)}
                                />
                            )}
                        </Form.Item> */}

                        <Form.Item label={<IntlMessages id="global.status" />}>
                            {getFieldDecorator("status", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select status of promotion"
                                    }
                                ],
                                initialValue: record ? record.status ? record.status.toString() : "1" : "1"
                            })(
                                <BaseSelect
                                    showSearch
                                    options={statusOption}
                                    selected={record ? record.status ? record.status.toString() : "1" : "1"}
                                // onChange={value => console.log(value)}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="global.start_date" />}>
                            {getFieldDecorator("start_date", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select start date of promotion"
                                    }
                                ],
                                initialValue: record && record.start_date ? moment(record.start_date) : null
                            })(
                                <DatePicker
                                    disabledTime={d => !d || d.isSameOrBefore(record && record.end_date)}
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="global.end_date" />}>
                            {getFieldDecorator("end_date", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select end date of promotion"
                                    }
                                ],
                                initialValue: record && record.end_date ? moment(record.end_date) : null
                            })(
                                <DatePicker
                                    disabledTime={d => !d || d.isSameOrAfter(record && record.start_date)}
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="promotion.start_buy_date" />}>
                            {getFieldDecorator("start_buy", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select start buy date of promotion"
                                    }
                                ],
                                initialValue: record && record.start_buy ? moment(record.start_buy) : null
                            })(
                                <DatePicker
                                    disabledTime={d => !d || d.isSameOrBefore(record && record.end_buy)}
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="promotion.end_buy_date" />}>
                            {getFieldDecorator("end_buy", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Select end buy date of promotion"
                                    }
                                ],
                                initialValue: record && record.end_buy ? moment(record.end_buy) : null
                            })(
                                <DatePicker
                                    disabledTime={d => !d || d.isSameOrAfter(record && record.start_buy)}
                                    showTime
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="global.image" />}>
                            <InputChosseFile
                                onChange={this.getValueChosseFile}
                                limit={1}
                                defautValue={dedfaultImage}
                            ></InputChosseFile>
                        </Form.Item>

                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type='default'
                                    onClick={() => onClose()}
                                    loading={isSubmiting}
                                >
                                    <IntlMessages id="global.cancel" />
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: 8 }}
                                    htmlType="submit"
                                    loading={isSubmiting}
                                >
                                    <IntlMessages id="global.save" />
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}


export default Form.create({ name: "add" })(Add);
