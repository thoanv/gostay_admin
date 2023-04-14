import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Radio } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import React, { Component } from "react";
import { connect } from "react-redux";
import SunEditor, { buttonList } from "suneditor-react";
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../../fileManager/InputChosseFile";

class AddCar extends Component {
    state = {
        image: "",
    };

    // componentDidMount() {
    //     this.props.getAllAccount({}, "supplier");
    // }

    onHandleClose = () => {
        this.props.onClose();
    };


    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data && data[0] ? data[0].path_relative : ""
        });
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
                value.image = [this.state.image];
                console.log(value)
                this.props.onSave(value, this.props.item ? this.props.item.id : null);
            } else {
            }
        })
            .then(this.setState({ image: "" }));
        ;
    };


    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.item && nextProps.item !== this.props.item) {
            this.setState({
                ...nextProps,
                image: nextProps.item && nextProps.item.image && nextProps.item.image.length ? nextProps.item.image[0] : ""
            });
        }
    }

    onSearchAccount = (v) => {
        let filter = {
            search: v
        }
        this.setState({
            ...this.state,
            loadingSearchAccount: true
        }, async () => {
            try {
                this.props.getAllAccount(filter, "supplier")
                this.setState({
                    ...this.state,
                    loadingSearchAccount: false
                })
            } catch (error) {
                this.setState({
                    ...this.state,
                    loadingSearchAccount: false
                })
            }
        })
    }


    render() {
        const { open, edit, item } = this.props;
        // let supplier = listAccount && listAccount.length ? listAccount.map(item => {
        //     return {
        //         id: item.id,
        //         title: `${item.firstname} ${item.lastname} - ${item.company}`
        //     }
        // }) : [];

        const CarType = this.props.config && this.props.config.car_type ? this.props.config.car_type.map(item => { return { ...item, id: item.ma } }) : [];

        const dedfaultImage = item
            ? item.image && item.image.length
                ? [{ name: item.image, path_relative: item.image }]
                : []
            : [];

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
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                            {/* <Form.Item label={<IntlMessages id="global.company" />}>
                                {getFieldDecorator("cid", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select company!",
                                        },
                                    ],
                                    initialValue: item ? item.cid || "" : "",
                                })(
                                    <BaseSelect
                                        options={supplier}
                                        selected={item ? item.cid : ""}
                                        showSearch={true}
                                        onSearch={this.onSearchAccount}
                                        loading={this.state.loadingSearchAccount}
                                    />
                                )}
                            </Form.Item> */}
                            <Form.Item label={<IntlMessages id="vehicle.type" />}>
                                {getFieldDecorator("type", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select type!",
                                        },
                                    ],
                                    initialValue: item ? item.type || "" : "",
                                })(
                                    <BaseSelect
                                        options={CarType}
                                        selected={item ? item.type : ""}
                                        showSearch={true}
                                    />
                                )}
                            </Form.Item>
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
                            <Form.Item label={<IntlMessages id="car.year" />}>
                                {getFieldDecorator("year", {

                                    initialValue: item ? item.year || "" : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="car.seat" />}>
                                {getFieldDecorator("seat", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input seat!"
                                        }
                                    ],
                                    initialValue: item ? item.seat || "" : "",
                                })(<InputNumber min={0} style={{ width: "100%" }} />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="car.luggage" />}>
                                {getFieldDecorator("luggage", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input luggage!"
                                        }
                                    ],
                                    initialValue: item ? item.luggage || "" : "",
                                })(<InputNumber min={0} style={{ width: "100%" }} />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.status" />}>
                                {getFieldDecorator("status", {
                                    initialValue: item ? (item.status === 1 ? 1 : 0) : 1,
                                })(
                                    <Radio.Group name="radiogroup">
                                        <Radio value={1}>
                                            <IntlMessages id="global.active" />
                                        </Radio>
                                        <Radio value={0}>
                                            <IntlMessages id="global.deactivate" />
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            <Form.Item label={<IntlMessages id="global.image" />}>
                                <InputChosseFile
                                    onChange={this.getValueChosseFile}
                                    limit={1}
                                    defautValue={dedfaultImage}
                                ></InputChosseFile>
                            </Form.Item>

                        </TabPane>

                        <TabPane tab={<IntlMessages id="global.desc" />} key="2">
                            <Form.Item {...formDesc}>
                                {getFieldDecorator("description", {
                                    initialValue:
                                        item ? item.description || "" : ""
                                })(
                                    <SunEditor
                                        setContents={item ? item.description || "" : ""}
                                        placeholder="Please type here..."
                                        setOptions={{
                                            buttonList: buttonList.complex,
                                            height: 300
                                        }}
                                    />
                                )}
                            </Form.Item>
                        </TabPane>

                    </Tabs>
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
const mapStateToProps = state => {
    return {
        authUser: state.authUser.data,
        config: state.config
    };
};
function mapDispatchToProps(dispatch) {
    return {
    };
}

export default Form.create({ name: "Car" })(
    connect(mapStateToProps, mapDispatchToProps)(AddCar)
)