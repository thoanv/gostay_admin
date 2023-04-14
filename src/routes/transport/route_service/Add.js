import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Radio } from "antd";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";

class Add extends Component {

    onHandleClose = () => {
        this.props.onClose();
    };



    onFinish = (e) => {
        e.preventDefault();
        let { authUser } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var value = {
                    ...values,
                    cid: authUser.id
                };
                this.props.onSave(value, this.props.item ? this.props.item.id : null);
            } else {
            }
        })
    };



    render() {
        const { open, edit, item, intl } = this.props;

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 }
            }
        };

        return (
            <Modal
                title={
                    edit ? (
                        <IntlMessages id="global.edit" />
                    ) : (
                            <IntlMessages id="global.add_new" />
                        )
                }
                visible={open}
                closable={true}
                destroyOnClose={true}
                onCancel={this.onHandleClose}
                footer={null}
                centered={true}
                width="800px"
            >
                <Form {...formItemLayout}
                    onSubmit={this.onFinish}
                    labelAlign='right'
                >
                    <Form.Item label={<IntlMessages id="global.title" />}>
                        {getFieldDecorator("title", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input  title !"
                                }
                            ],
                            initialValue: item ? item.title || "" : ""
                        })(<Input />)}
                    </Form.Item>
                    <Row>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Button
                                type="default"
                                onClick={() => this.onHandleClose()}
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
        );
    }
}

export default Form.create({ name: "route_service" })(Add);