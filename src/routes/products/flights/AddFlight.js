import React, { Component } from 'react';
import { Modal, Button, Icon, List, Form, Input, Row, Col, Checkbox } from 'antd';
import BaseSelect from 'Components/Elements/BaseSelect';
import IntlMessages from 'Util/IntlMessages';
import { connect } from 'react-redux';

class AddFlight extends Component {
    render() {
        var {destinations, airlines} = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };

        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title={<IntlMessages id="global.create" />}
                visible={this.props.visible}
                onCancel={() => this.onCloseModal()}
            // footer={null}
            >
                <Form {...formItemLayout} onSubmit={(e) => this.submit(e)}>
                    {/* <Form.Item label={<IntlMessages id="global.departures" />}>
                        {
                            getFieldDecorator("departure", {
                                rules: [
                                    { required: true, message: "Please choose destination" }
                                ],
                            })(
                                <BaseSelect
                                    showSearch
                                    options={destinations}
                                    defaultText="Select departure"
                                    optionValue="code"
                                    onChange={(value) => this.onFilter('departure', value)}
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item label={<IntlMessages id="global.arrival" />}>
                        {
                            getFieldDecorator("arrival", {
                                rules: [
                                    { required: true, message: "Please choose arrival" }
                                ],
                            })(
                                <BaseSelect
                                    showSearch
                                    options={destinations}
                                    defaultText="Select arrival"
                                    optionValue="code"
                                    onChange={(value) => this.onFilter('arrival', value)}
                                />
                            )
                        }
                    </Form.Item> */}
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item label={<IntlMessages id="global.seat" />}>
                                {
                                    getFieldDecorator("seat", {
                                        // initialValue: currentRate ? currentRate.seat : 0,
                                        rules: [
                                            { required: true, message: "Please fill out seat!" }
                                        ],
                                    })(
                                        <Input type="number" />
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<IntlMessages id="global.price" />}>
                                {
                                    getFieldDecorator("price", {
                                        // initialValue: currentRate ? currentRate.price : 0,
                                        rules: [
                                            { required: true, message: "Please fill out price!" }
                                        ],
                                    })(
                                        <Input type="number" suffix="$" />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Button
                                className="ml-4"
                                type='default'
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
                    </Row> */}
                </Form>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddFlight));