import { Button, Col, Form, Input, Tag, Row, Tabs, Spin, Result, Alert, Card, Modal, Icon, TimePicker } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import { _createRoute, _updateRoute } from "../../../actions/CarAction";
import SunEditor, { buttonList } from "suneditor-react";
import { _searchAccount } from "../../../actions/AccountAction";
import { searchDestination } from '../../../actions/DestinationActions';
import { _searchCar } from "../../../actions/CarAction";
import BaseSelect from "../../../components/Elements/BaseSelect";
import { _getAll } from "../../../actions/RouteServiceAction";
import { CarType } from '../../../components/CarType';
import moment from 'moment';

const { confirm } = Modal;

const VehicleType = ({ type }) => {
    switch (type) {
        case 1:
            return <Tag color="magenta">Van</Tag>;
        case 2:
            return <Tag color="green">Standard</Tag>;
        case 3:
            return <Tag color="geekblue">Bus</Tag>;

        default:
            return "";
    }
}

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

const placeholder = {
    select_title: () => <IntlMessages id="global.input_title" />
}

class AddRouteScreen extends Component {
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
            firstLoading: true,
            isSubmiting: false,
            isSuccess: false,
            vehicle: null,
            customer: null,
            airport: null
        }
    }

    async componentDidMount() {
        try {
            await this.props._getAllRouteService({ paging: 0 });
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
                    title: `${item.firstname} ${item.lastname} - ${item.company}`,
                    mobile: item.mobile,
                    email: item.email,
                    image: item.image
                }
            }) : [];
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


    setStateFalse() {
        this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            item: null,
            edit: false,
        });
    }

    showConfirm() {
        confirm({
            title: "Thành công",
            content: "Tạo tuyến đường thành công. Bạn có muốn tiếp tục tạo tuyến đường khác?",
            onOk: () => {
                this.setStateFalse();
            },
            onCancel: () => {
                this.setStateFalse();
                this.props.history.push('/app/transport/route');
            },
            okText: "Tiếp tục tạo",
            cancelText: "Quay lại danh sách",
            icon: <Icon type="check-circle" />
        });
    }

    onSave = (data, id) => {
        this.setState({
            ...this.state,
            isSubmiting: true,
        }, async () => {
            if (this.state.edit) {
                try {
                    var dataSubmit = { ...data, id: id };
                    await this.props._update(dataSubmit);
                    this.setStateFalse();
                } catch (error) {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                    });
                }
            } else {
                try {
                    await this.props._create(data);
                    this.showConfirm();
                } catch (error) {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                    });
                }
            }
        });
    };

    onFinish = (e) => {
        e.preventDefault();
        this.props.form
            .validateFields((err, values) => {
                if (!err) {
                    var value = { ...values, status: 1, approved: 1, start_night: values.start_night.format("HH:mm"), end_night: values.end_night.format("HH:mm") };

                    this.onSave(
                        value,
                        this.props.item ? this.props.item.id : null
                    );
                }
            })

    };

    onChangeVehicle = (v) => {
        if (v) {
            let { listVehicle } = this.state;
            let vehicle = {};
            for (let i = 0; i < listVehicle.length; i++) {
                if (listVehicle[i].id == v) vehicle = listVehicle[i];
            }
            this.setState({
                ...this.state,
                vehicle: vehicle
            })
        }
        else {
            this.setState({
                ...this.state,
                vehicle: null
            })
        }
    }

    onChangeCustomer = (v) => {
        if (v) {
            let { listAccount } = this.state;
            let account = {};
            for (let i = 0; i < listAccount.length; i++) {
                if (listAccount[i].id == v) account = listAccount[i];
            }
            this.setState({
                ...this.state,
                customer: account
            })
        }
        else {
            this.setState({
                ...this.state,
                customer: null
            })
        }
    }

    onChangeAirport = (v) => {
        if (v) {
            let { listAirport } = this.state;
            let airport = {};
            for (let i = 0; i < listAirport.length; i++) {
                if (listAirport[i].id == v) airport = listAirport[i];
            }
            this.setState({
                ...this.state,
                airport: airport
            })
        }
        else {
            this.setState({
                ...this.state,
                airport: null
            })
        }
    }

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

    resetForm() {
        this.props.form.resetFields();
        this.setState({
            ...this.state,
            vehicle: null,
            customer: null,
            airport: null
        })
    }



    render() {
        const { TabPane } = Tabs;
        const { getFieldDecorator } = this.props.form;
        var { listAccount, listVehicle, listAirport, listCity, listDistrict, vehicle, airport, customer } = this.state;
        console.log("customer", customer)
        console.log("airport", airport)
        console.log(this.context)
        var { config, listRouteService } = this.props;
        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="global.route_add" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <Spin spinning={this.state.firstLoading} >
                                {
                                    this.state.isSuccess ? (
                                        <Result
                                            // icon={<img src={require('../../../../assets/img/hotel.png')} width={400} />}
                                            title={<IntlMessages id="property.congratulations" />}
                                            subTitle={<IntlMessages id="property.sub_congratulations" />}
                                            extra={<Button type="primary" onClick={() => this.props.history.push('/app/transfer/route')}><IntlMessages id="property.back" /></Button>}
                                        />
                                    ) : (
                                            <Row gutter={16} className="vh-75 mt-4">
                                                <Col xs={24} sm={24} md={18}>
                                                    <Card className="vh-75" style={{ overflow: 'auto' }}>
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
                                                                        })(
                                                                            <BaseSelect
                                                                                placeholder={<IntlMessages id="global.select_customer" />}
                                                                                options={listAccount}
                                                                                showSearch={true}
                                                                                onChange={this.onChangeCustomer}
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
                                                                        })(
                                                                            <BaseSelect
                                                                                placeholder={<IntlMessages id="global.select_vehicle" />}
                                                                                options={listVehicle}
                                                                                showSearch={true}
                                                                                onChange={this.onChangeVehicle}
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
                                                                        })(
                                                                            <BaseSelect
                                                                                placeholder={<IntlMessages id="global.select_airport" />}
                                                                                options={listAirport}
                                                                                showSearch={true}
                                                                                onChange={this.onChangeAirport}
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
                                                                        })(
                                                                            <BaseSelect
                                                                                placeholder={<IntlMessages id="global.select_city" />}
                                                                                options={listCity}
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
                                                                        })(
                                                                            <BaseSelect
                                                                                placeholder={<IntlMessages id="global.select_district" />}
                                                                                options={listDistrict}
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
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.min" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.price_onward" />}>
                                                                        {getFieldDecorator("price_onward", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                                                    </Form.Item>
                                                                    {/* <Form.Item label={<IntlMessages id="global.price_discount_onward" />}>
                                    {getFieldDecorator("price_discount_onward", {
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                                                    <Form.Item label={<IntlMessages id="global.price_return" />}>
                                                                        {getFieldDecorator("price_return", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                                                    </Form.Item>
                                                                    {/* <Form.Item label={<IntlMessages id="global.price_discount_return" />}>
                                    {getFieldDecorator("price_discount_return", {
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                                                    {/* <Form.Item label={<IntlMessages id="global.price_round" />}>
                                                                        {getFieldDecorator("price_round", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                                                    </Form.Item> */}
                                                                    {/* <Form.Item label={<IntlMessages id="global.price_discount_round" />}>
                                    {getFieldDecorator("price_discount_round", {
                                    })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                </Form.Item> */}
                                                                    <Form.Item label={<IntlMessages id="global.price_add_night" />}>
                                                                        {getFieldDecorator("price_add_night", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.price_add_holiday" />}>
                                                                        {getFieldDecorator("price_add_holiday", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.$" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.free" />}>
                                                                        {getFieldDecorator("free_waiting_time", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.free" />}>
                                                                        {getFieldDecorator("free_waiting_time_i", {
                                                                        })(
                                                                            <Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time_i" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.free" />} name="free_waiting_time_return">
                                                                        {getFieldDecorator("free_waiting_time_return", {
                                                                        })(
                                                                            <Input style={{ width: "100%" }} suffix={<IntlMessages id="global.free_waiting_time_return" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.waiting_fee" />} name="waiting_fee">
                                                                        {getFieldDecorator("waiting_fee", {
                                                                        })(
                                                                            <Input style={{ width: "100%" }} suffix={<IntlMessages id="global.per_hour" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="global.free_cancel_hour_policy" />}>
                                                                        {getFieldDecorator("cancel_hour_policy", {
                                                                        })(<Input style={{ width: "100%" }} suffix={<IntlMessages id="global.cancel_hour_policy" />} />)}
                                                                    </Form.Item>
                                                                    <Form.Item label={<IntlMessages id="sidebar.route_service" />}>
                                                                        {getFieldDecorator("services", {

                                                                        })(
                                                                            <BaseSelect
                                                                                mode="multiple"
                                                                                placeholder={<IntlMessages id="sidebar.route_service" />}
                                                                                options={listRouteService}
                                                                                showSearch={true}
                                                                            />
                                                                        )}
                                                                    </Form.Item>
                                                                    <Form.Item label={"Bắt đầu PT đêm"}>
                                                                        {getFieldDecorator("start_night", {
                                                                            initialValue: moment('23:00', 'HH:mm')
                                                                        })(
                                                                            <TimePicker format={"HH:mm"} style={{ width: "100%" }} />
                                                                        )}
                                                                    </Form.Item>
                                                                    <Form.Item label={"Kết thúc PT đêm"}>
                                                                        {getFieldDecorator("end_night", {
                                                                            initialValue: moment('05:00', 'HH:mm')
                                                                        })(
                                                                            <TimePicker format={"HH:mm"} style={{ width: "100%" }} />
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
                                                                        })(
                                                                            <SunEditor
                                                                                placeholder={<IntlMessages id="global.type_desc" />}
                                                                                setOptions={{
                                                                                    buttonList: buttonList.complex,
                                                                                }}
                                                                                height={500}
                                                                            />
                                                                        )}
                                                                    </Form.Item>
                                                                </TabPane>
                                                                <TabPane tab={<IntlMessages id="sidebar.terms&Conditions" />} key="3">
                                                                    <Form.Item {...formDesc}>
                                                                        {getFieldDecorator("term_condition", {
                                                                        })(
                                                                            <SunEditor
                                                                                placeholder="Please type here..."
                                                                                setOptions={{
                                                                                    buttonList: buttonList.complex,
                                                                                }}
                                                                                height={500}
                                                                            />
                                                                        )}
                                                                    </Form.Item>
                                                                </TabPane>

                                                            </Tabs>
                                                            <Row>
                                                                <Col span={24} style={{ textAlign: "right" }}>
                                                                    <Button type="default" onClick={() => this.resetForm()}>
                                                                        <IntlMessages id="global.cancel" />
                                                                    </Button>
                                                                    <Button
                                                                        type="primary"
                                                                        style={{ marginLeft: 8 }}
                                                                        htmlType="submit"
                                                                        loading={this.state.isSubmiting}
                                                                    >
                                                                        <IntlMessages id="global.submit" />
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} sm={24} md={6} className="d-flex flex-column justify-content-between fixed">

                                                    <div>
                                                        {customer ?
                                                            <Card title={<div style={{ fontSize: "16px", fontWeight: "bold" }}><IntlMessages id="global.customer_info" /></div>} style={{ width: "100%" }}>
                                                                <Row>
                                                                    {customer.image ?
                                                                        <Col md={8}>
                                                                            <img
                                                                                src={config.url_asset_root + customer.image}
                                                                                alt="image"
                                                                            />
                                                                        </Col>
                                                                        : null}
                                                                    <Col md={16}>
                                                                        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>{customer.title}</div>
                                                                        <div style={{ alignItems: "center", marginBottom: "0px" }}>
                                                                            {customer.mobile ? <p style={{ fontSize: "14px", marginBottom: "0px" }}><Icon type="phone" /> {customer.mobile}</p> : null}
                                                                            {customer.email ? <p style={{ fontSize: "14px", marginBottom: "0px" }}><Icon type="mail" /> {customer.email}</p> : null}
                                                                        </div>
                                                                    </Col>
                                                                </Row>


                                                            </Card>
                                                            : null}

                                                        {vehicle ?
                                                            <Card title={<div style={{ fontSize: "16px", fontWeight: "bold" }}><IntlMessages id="global.vehicle_info" /></div>} style={{ width: "100%" }}>
                                                                <Row>
                                                                    {vehicle.image && vehicle.image.length ?
                                                                        <Col md={8}>
                                                                            <img
                                                                                src={vehicle.image && vehicle.image.length ? config.url_asset_root + vehicle.image[0] : ""}
                                                                                alt="image"
                                                                            />
                                                                        </Col>
                                                                        : null}
                                                                    <Col md={16}>
                                                                        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>{vehicle.title}</div>
                                                                        <div style={{ alignItems: "center", marginBottom: "0px" }}>
                                                                            <span style={{ fontSize: "14px", marginRight: "10px" }}><Icon type="user" />{vehicle.seat}</span>
                                                                            <span style={{ fontSize: "14px" }}><Icon type="shop" /> {vehicle.luggage}</span>
                                                                        </div>
                                                                        <div>
                                                                            <b><CarType type={vehicle.type} /></b>
                                                                        </div>
                                                                    </Col>
                                                                </Row>


                                                            </Card>
                                                            : null}

                                                        {airport ?
                                                            <Card title={<div style={{ fontSize: "16px", fontWeight: "bold" }}><IntlMessages id="global.airport_info" /></div>} style={{ width: "100%" }}>
                                                                <Row>
                                                                    {airport.image ?
                                                                        <Col md={8}>
                                                                            <img
                                                                                src={config.url_asset_root + airport.image}
                                                                                alt="image"
                                                                            />
                                                                        </Col>
                                                                        : null}
                                                                    <Col md={16}>
                                                                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{airport.title}</div>
                                                                        {airport.full_paths ?
                                                                            <div style={{ alignItems: "center", marginBottom: "0px" }}>
                                                                                <p style={{ fontSize: "14px", marginRight: "10px", marginBottom: "0px" }}><Icon type="environment" />{airport.full_paths}</p>
                                                                            </div>
                                                                            : null}
                                                                        {airport.code ?
                                                                            <div>
                                                                                <Tag color="geekblue">{airport.code}</Tag>
                                                                            </div>
                                                                            : null}
                                                                    </Col>
                                                                </Row>


                                                            </Card>
                                                            : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                }
                            </Spin>
                        </RctCollapsibleCard>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        config: state.config,
        listRouteService: state.route_service.list,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _update: (id) => dispatch(_updateRoute(id)),
        _create: (data) => dispatch(_createRoute(data)),
        _getAllRouteService: (filter) => dispatch(_getAll(filter)),
    };
};


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Form.create({ name: "route" })(AddRouteScreen))
);

