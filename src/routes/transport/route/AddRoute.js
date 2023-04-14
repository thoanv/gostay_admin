import { Button, Col, Form, Input, Modal, Radio, Row, Tabs, Spin } from "antd";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "../../../components/Elements/BaseSelect";
import SunEditor, { buttonList } from "suneditor-react";
import { _searchAccount } from "../../../actions/AccountAction";
import { searchDestination } from '../../../actions/DestinationActions';
import { _searchCar } from "../../../actions/CarAction";

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

const formDesc = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
};

class AddRoute extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loadingSearchDistric: false,
            listAccount: [],
            listAirport: [],
            listVehicle: [],
            listCity: [],
            listDistrict: [],
            firstLoading: true
        }
    }

    static defaultProps = {
        edit: false,
        open: false,
    };


    onHandleClose = () => {
        this.props.onClose();
    };


    async  componentDidMount() {
        try {
            let airport = await searchDestination({
                type: {
                    type: "=",
                    value: "airport",
                },
                paging: 0
            });
            let city = await searchDestination({
                type: {
                    type: "=",
                    value: "province",
                },
                paging: 0
            });
            let vehicle = await _searchCar({ paging: 0 });
            let account = await _searchAccount({ paging: 0 }, "supplier");
            let supplier = account && account.list && account.list.length ? account.list.map(item => {
                return {
                    id: item.id,
                    title: `${item.firstname} ${item.lastname} - ${item.company}`
                }
            }) : [];
            console.log(account)
            this.setState({
                ...this.state,
                listAirport: airport.list,
                listCity: city.list,
                listVehicle: vehicle.list,
                listAccount: supplier,
                firstLoading: false
            })
        } catch (error) {
            this.setState({
                ...this.state,
                firstLoading: false
            })
        }

    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.item && nextProps.item != this.props.item) {
            let { city } = nextProps.item;
            if (city) {
                let district = await searchDestination({
                    type: {
                        type: "=",
                        value: "district",
                    },
                    province: {
                        type: "=",
                        value: city
                    }
                });
                this.setState({
                    ...this.state,
                    listDistrict: district.list
                })
            }
        }
    }


    onFinish = (e) => {
        e.preventDefault();
        this.props.form
            .validateFields((err, values) => {
                if (!err) {
                    var value = { ...values };

                    this.props.onSave(
                        value,
                        this.props.item ? this.props.item.id : null
                    );

                }
            })

    };

    onChangeCity = (v) => {
        this.setState({
            ...this.state,
            loadingSearchDistric: true
        }, async () => {
            try {
                let district = await searchDestination({
                    type: {
                        type: "=",
                        value: "district",
                    },
                    province: {
                        type: "=",
                        value: v
                    },
                    paging: 0
                });
                this.setState({
                    ...this.state,
                    listDistrict: district.list,
                    loadingSearchDistric: false
                })
            } catch (error) {
                this.setState({
                    ...this.state,
                    loadingSearchDistric: false
                })
            }
        })
    }



    render() {
        const { open, edit, item } = this.props;
        const { TabPane } = Tabs;
        const { getFieldDecorator } = this.props.form;
        var { listAccount, listVehicle, listAirport, listCity, listDistrict } = this.state;
        return (
            <Modal
                title={edit ? (
                    <IntlMessages id="global.edit" />
                ) : (
                        <IntlMessages id="global.add_new" />
                    )
                }
                visible={open}
                closable={true}
                onCancel={this.onHandleClose}
                footer={null}
                width="800px"
                destroyOnClose={true}
            >
                <Spin spinning={this.state.firstLoading} >
                    <Form {...formItemLayout}
                        onSubmit={this.onFinish}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                                <Form.Item label={<IntlMessages id="global.company" />}>
                                    {getFieldDecorator("cid", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please select a company!",
                                            },
                                        ],
                                        initialValue: item ? item.cid || "" : "",
                                    })(
                                        <BaseSelect
                                            options={listAccount}
                                            selected={item ? item.cid : ""}
                                            showSearch={true}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="sidebar.vehicle" />}>
                                    {getFieldDecorator("vehicle_id", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please choose a vehicle !",
                                            },
                                        ],
                                        initialValue: item ? item.vehicle_id || "" : "",
                                    })(
                                        <BaseSelect
                                            options={listVehicle}
                                            selected={item ? item.vehicle_id : ""}
                                            showSearch={true}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.title" />}>
                                    {getFieldDecorator("title", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input title!",
                                            },
                                        ],
                                        initialValue: item ? item.title || "" : "",
                                    })(<Input />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.airport" />}>
                                    {getFieldDecorator("airport", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please select a airport !",
                                            },
                                        ],
                                        initialValue: item ? item.airport || "" : "",
                                    })(
                                        <BaseSelect
                                            options={listAirport}
                                            selected={item ? item.airport : ""}
                                            showSearch={true}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.city" />}>
                                    {getFieldDecorator("city", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please choose a city !",
                                            },
                                        ],
                                        initialValue: item ? item.city || "" : "",
                                    })(
                                        <BaseSelect
                                            options={listCity}
                                            selected={item ? item.city : ""}
                                            showSearch={true}
                                            onChange={this.onChangeCity}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.district" />}>
                                    {getFieldDecorator("place", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please choose a place !",
                                            },
                                        ],
                                        initialValue: item ? item.place || "" : "",
                                    })(
                                        <BaseSelect
                                            options={listDistrict}
                                            selected={item ? item.place : ""}
                                            showSearch={true}
                                            loading={this.state.loadingSearchDistric}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="route.duration" />}>
                                    {getFieldDecorator("duration", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input duration!",
                                            },
                                        ],
                                        initialValue: item ? item.duration || "" : "",
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.min" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.price_onward" />}>
                                    {getFieldDecorator("price_onward", {
                                        initialValue: item ? item.price_onward : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item>
                                {/* <Form.Item label={<IntlMessages id="global.price_discount_onward" />}>
                                    {getFieldDecorator("price_discount_onward", {
                                        initialValue: item ? item.price_discount_onward : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                <Form.Item label={<IntlMessages id="global.price_return" />}>
                                    {getFieldDecorator("price_return", {
                                        initialValue: item ? item.price_return : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item>
                                {/* <Form.Item label={<IntlMessages id="global.price_discount_return" />}>
                                    {getFieldDecorator("price_discount_return", {
                                        initialValue: item ? item.price_discount_return : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                {/* <Form.Item label={<IntlMessages id="global.price_round" />}>
                                    {getFieldDecorator("price_round", {
                                        initialValue: item ? item.price_round : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                {/* <Form.Item label={<IntlMessages id="global.price_discount_round" />}>
                                    {getFieldDecorator("price_discount_round", {
                                        initialValue: item ? item.price_discount_round : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                <Form.Item label={<IntlMessages id="global.price_add_night" />}>
                                    {getFieldDecorator("price_add_night", {
                                        initialValue: item ? item.price_add_night : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.price_add_holiday" />}>
                                    {getFieldDecorator("price_add_holiday", {
                                        initialValue: item ? item.price_add_holiday : 0,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.free" />}>
                                    {getFieldDecorator("free_waiting_time", {
                                        initialValue: item ? item.free_waiting_time : null,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.free" />}>
                                    {getFieldDecorator("free_waiting_time_i", {
                                        initialValue: item ? item.free_waiting_time_i : null,
                                    })(
                                        <Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time_i" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.free" />} name="free_waiting_time_return">
                                    {getFieldDecorator("free_waiting_time_return", {
                                        initialValue: item ? item.free_waiting_time_return : null,
                                    })(
                                        <Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time_return" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.free_cancel_hour_policy" />}>
                                    {getFieldDecorator("cancel_hour_policy", {
                                        initialValue: item ? item.cancel_hour_policy : null,
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.cancel_hour_policy" />} />)}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.status" />}>
                                    {getFieldDecorator("status", {
                                        initialValue: item ? (item.status === 1 ? 1 : item.status === 2 ? 2 : 0) : 1,
                                    })(
                                        <Radio.Group name="radiogroup">
                                            <Radio value={1}>
                                                <IntlMessages id="global.published" />
                                            </Radio>
                                            <Radio value={0}>
                                                <IntlMessages id="global.unpublished" />
                                            </Radio>
                                            <Radio value={2}>
                                                <IntlMessages id="global.trashed" />
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.approved" />}>
                                    {getFieldDecorator("approved", {
                                        initialValue: item ? (item.approved === 1 ? 1 : 0) : 1,
                                    })(
                                        <Radio.Group name="radiogroup">
                                            <Radio value={1}>
                                                <IntlMessages id="global.yes" />
                                            </Radio>
                                            <Radio value={0}>
                                                <IntlMessages id="global.no" />
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </TabPane>
                            <TabPane tab={<IntlMessages id="global.desc" />} key="2">
                                <Form.Item {...formDesc}>
                                    {getFieldDecorator("description", {
                                        rules: [
                                            {
                                                required: false,
                                                message: "Please input description!",
                                            },
                                        ],
                                        initialValue: item ? item.description || "" : "",
                                    })(
                                        <SunEditor
                                            setContents={item ? item.description : ""}
                                            placeholder="Please type here..."
                                            setOptions={{
                                                buttonList: buttonList.complex,
                                            }}
                                            height={400}
                                        />
                                    )}
                                </Form.Item>
                            </TabPane>
                            <TabPane tab={<IntlMessages id="sidebar.terms&Conditions" />} key="3">
                                <Form.Item {...formDesc}>
                                    {getFieldDecorator("term_condition", {
                                        initialValue: item ? item.term_condition || "" : "",
                                    })(
                                        <SunEditor
                                            setContents={item ? item.term_condition : ""}
                                            placeholder="Please type here..."
                                            setOptions={{
                                                buttonList: buttonList.complex,
                                            }}
                                            height={400}
                                        />
                                    )}
                                </Form.Item>
                            </TabPane>

                        </Tabs>
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button type="default" onClick={() => this.onHandleClose()}>
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
                </Spin>
            </Modal>
        );
    }
}


export default Form.create({ name: "route" })(AddRoute);
