import { Button, Col, Form, Input, InputNumber, Modal, Row, Tabs, Radio } from "antd";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";


class Add extends Component {

    onHandleClose = () => {
        this.props.onClose();
    };

    onFinish = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var value = {
                    ...values,
                };
                this.props.onSave(value, this.props.item ? this.props.item.id : null);
            } else {
            }
        })
            .then(this.setState({ image: "" }));
        ;
    };


    render() {
        const { open, edit, item } = this.props;

        const { getFieldDecorator } = this.props.form;
        const { TabPane } = Tabs;
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
                    labelAlign='left'
                >
                    <Form.Item label={"Mã loại xe"}>
                        {getFieldDecorator("ma", {
                            rules: [
                                {
                                    required: true,
                                },
                            ],
                            initialValue: item ? item.ma || "" : "",
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={"Tên loại xe"}>
                        {getFieldDecorator("title", {
                            rules: [
                                {
                                    required: true,
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

export default Form.create({ name: "CarType" })(Add);