import { Button, Col, Form, Input, Modal, Row, Select, Tabs } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import SunEditor, { buttonList } from "suneditor-react";
import IntlMessages from "Util/IntlMessages";
import CustomPlacesAutoComplete from "../../../components/Elements/CustomPlacesAutoComplete";
import datatimezone from "../../../components/share/dataTimezone";
import InputChosseFile from "../../fileManager/InputChosseFile";
// actions
import { getAllDestinationParent, getAllDestination } from "../../../actions/DestinationActions";

const { Option } = Select;
const { TabPane } = Tabs;

class AddDestination extends Component {
    state = {
        currentDestination: null,
        destinationParent: null,
        image: "",
        gallery: [],
        latitude: 0,
        longitude: 0,
        datatime: [],
        country_id: "",
        statusCountry: {},
        type: null,
        provinces: [],
        districts: [],
        wards: []
    };
    static propTypes = {
        destination: PropTypes.object,
        onSaveDestination: PropTypes.func,
        open: PropTypes.bool,
        onDestinationClose: PropTypes.func,
        edit: PropTypes.bool,
        country: PropTypes.array
    };

    static getDerivedStateFromProps(props, state) {
        if (state.currentDestination !== props.destination) {
            console.log(props.destination)
            var dt = [];
            if (props.destination) {
                var datatime = [...datatimezone];
                datatime = datatime.filter(item => {
                    return item.contry_code === props.destination.country_code
                });

                dt = datatime.map(item => {
                    return {
                        id: item.tz[0],
                        title: item.tz[0],
                    }
                });
            }

            return {
                currentDestination: props.destination,
                datatime: dt,
                destinationParent: null,
                latitude: props.destination ? props.destination.latitude : 0,
                longitude: props.destination ? props.destination.longitude : 0,
                country_id: props.destination ? props.destination.country_id ? props.destination.country_id : "" : "",
                image: props.destination
                    ? props.destination.image
                        ? props.destination.image
                        : ""
                    : "",
                gallery: props.destination
                    ? props.destination.gallery
                        ? JSON.parse(props.destination.gallery)
                        : []
                    : []
            };
        }

        return null;
    }

    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };
    getValueImage = data => {
        this.setState({
            ...this.state,
            gallery: data.length ? data.map(item => item.path_relative) : []
        });
    };

    async componentDidUpdate(prevProps, prevState) {
        // if (this.state.destinationParent === null) {
        //     if (this.state.currentDestination !== null) {
        //         this.props.getAllDestination({
        //             country_id: {
        //                 type: "=",
        //                 value: this.state.currentDestination.country_id
        //             },
        //             parent_id: {
        //                 type: "=",
        //                 value: 0
        //             },
        //             paging: 0
        //         }).then(res =>
        //             this.setState({
        //                 destinationParent: res.data.list
        //             })
        //         );
        //     }
        // }

        if (this.state.currentDestination) {
            var isFetchData = false;
            if (prevState.currentDestination) {
                if (this.state.currentDestination.id !== prevState.currentDestination.id) isFetchData = true;
            } else {
                isFetchData = true;
            }

            if (isFetchData) {
                var provinces = await this.props.getAllDestination({
                    country_id: {
                        type: "=",
                        value: this.state.currentDestination.country_id
                    },
                    type: {
                        type: "=",
                        value: 'province'
                    },
                    paging: 0
                }, false, false);
                var districts = await this.props.getAllDestination({
                    province: {
                        type: "=",
                        value: this.state.currentDestination.province
                    },
                    type: {
                        type: "=",
                        value: 'district'
                    },
                    paging: 0
                }, false, false);
                var wards = await this.props.getAllDestination({
                    district: {
                        type: "=",
                        value: this.state.currentDestination.district
                    },
                    type: {
                        type: "=",
                        value: 'ward'
                    },
                    paging: 0
                }, false, false);

                this.setState({ provinces, districts, wards })
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var destination = {
                    ...values,
                    country_id: this.state.country_id,
                    image: this.state.image,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    parent_id: values.parent_id ? values.parent_id : 0
                };
                if (this.state.country_id) {
                    destination.gallery = JSON.stringify(this.state.gallery);
                    this.props.onSaveDestination(
                        destination,
                        this.props.destination ? this.props.destination.id : null
                    ).then(res => this.setState({
                        image: ""
                    }))
                }
                else {
                    this.setState({
                        ...this.state,
                        statusCountry: {
                            validateStatus: "error",
                            help: "Please select country"
                        }
                    })
                }
            }
        }).then(this.setState({ gallery: [] }));
    }

    onSetLocation = (position, address, city_name) => {
        this.setState({
            ...this.state,
            latitude: position.lat,
            longitude: position.lng,
            address: address
        });
    };

    onChangeData = (name, value) => {
        this.setState({ [name]: value });
    }

    SelectCountry = async (v, opition) => {
        var datatime = [...datatimezone];
        datatime = datatime.filter(item => {
            return item.contry_code === opition.props.country_code
        });

        var provinces = await this.props.getAllDestination({
            country_id: {
                type: "=",
                value: opition.props.country_id
            },
            type: {
                type: "=",
                value: 'province'
            },
            paging: 0
        }, false, false);
        this.props.form.resetFields(['district', 'ward']);

        this.setState({
            ...this.state,
            country_id: opition.props.country_id,
            provinces: provinces,
            statusCountry: {},
            datatime: datatime.map(item => {
                return {
                    id: item.tz[0],
                    title: item.tz[0],
                }
            })
        });
    }

    async selectProvince(value) {
        var districts = await this.props.getAllDestination({
            province: {
                type: "=",
                value: value
            },
            type: {
                type: "=",
                value: 'district'
            },
            paging: 0
        }, false, false);

        this.props.form.resetFields(['ward']);
        this.setState({ districts });
    }

    async selectDistrict(value) {
        var wards = await this.props.getAllDestination({
            district: {
                type: "=",
                value: value
            },
            type: {
                type: "=",
                value: 'ward'
            },
            paging: 0
        }, false, false);

        this.setState({ wards });
    }

    showCountryOp = (country) => {
        if (country) {
            if (country.length) {
                return country.map(i => (
                    <Option value={i.id} key={i.id} country_id={i.id} country_code={i.code}>{i.title}</Option>
                ))
            }
        }
    }

    render() {
        const { country, open, onDestinationClose, edit, destination, destinations } = this.props;
        const { getFieldDecorator } = this.props.form;
        var { provinces, districts, wards } = this.state;

        const dedfaultImage = destination
            ? destination.image
                ? [{ name: destination.image, path_relative: destination.image }]
                : []
            : [];
        if (destinations.length > 0 && destinations[0].id !== 0) {
            destinations.unshift({
                id: 0,
                parent_id: 0,
                title: "No parent"
            });
        }
        const defaultImage = destination
            ? destination.gallery
                ? this.state.gallery.map(item => ({
                    name: item,
                    path_relative: item
                }))
                : []
            : [];


        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
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
            <React.Fragment>
                {open ? (
                    <Modal
                        title={
                            edit ? (
                                <IntlMessages id="destination.editdestination" />
                            ) : (
                                    <IntlMessages id="destination.adddestination" />
                                )
                        }
                        toggle={onDestinationClose}
                        visible={open}
                        closable={true}
                        destroyOnClose={true}
                        onCancel={this.props.onDestinationClose}
                        footer={null}
                        width="60%"
                        centered={true}
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            {/* <Tabs defaultActiveKey="1"> */}
                            {/* <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1"> */}
                            <Form.Item label={<IntlMessages id="global.title" />}>
                                {getFieldDecorator("title", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input  title !"
                                        }
                                    ],
                                    initialValue: destination ? destination.title || "" : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.alias" />}>
                                {getFieldDecorator("alias", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input  alias!"
                                        }
                                    ],
                                    initialValue: destination ? destination.alias || "" : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.code" />}>
                                {getFieldDecorator("code", {
                                    initialValue: destination ? destination.code || "" : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.country" />} {...this.state.statusCountry} >
                                <Select
                                    required
                                    value={this.state.country_id}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onSelect={this.SelectCountry}
                                    showSearch={true}
                                >
                                    <Option value={''} >Chọn quốc gia</Option>
                                    {this.showCountryOp(country)}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.type" />} >
                                {getFieldDecorator("type", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Bắt buộc"
                                        }
                                    ],
                                    initialValue: destination ? destination.type : null
                                })(
                                    <BaseSelect
                                        options={[
                                            { id: 'province', title: 'Tỉnh / Thành phố' },
                                            { id: 'district', title: 'Quận / Huyện / Thị xã' },
                                            { id: 'ward', title: 'Xã / Phường / Thị trấn' },
                                            { id: 'airport', title: 'Sân bay' }
                                        ]}
                                        defaultText="Chọn một option"
                                        onChange={(value) => this.onChangeData('type', value)}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.province" />}>
                                {getFieldDecorator("province", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Bắt buộc"
                                        }
                                    ],
                                    initialValue: destination ? destination.province : null
                                })(
                                    <BaseSelect
                                        options={provinces}
                                        defaultText="Chọn một option"
                                        onChange={(value) => this.selectProvince(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch={true}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.district" />}>
                                {getFieldDecorator("district", {
                                    initialValue: destination ? destination.district : null
                                })(
                                    <BaseSelect
                                        options={districts}
                                        defaultText="Chọn một option"
                                        onChange={(value) => this.selectDistrict(value)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch={true}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.ward" />}>
                                {getFieldDecorator("ward", {
                                    initialValue: destination ? destination.ward : null
                                })(
                                    <BaseSelect
                                        options={wards}
                                        defaultText="Chọn một option"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch={true}
                                    />
                                )}
                            </Form.Item>
                            {/* <Form.Item label={<IntlMessages id="global.timezone" />}>
                                {getFieldDecorator("timezone", {
                                    initialValue: destination ? destination.timezone : ""
                                })(
                                    <BaseSelect
                                        options={this.state.datatime}
                                        selected={destination ? destination.timezone : ""}
                                        defaultText="Select timezone"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch={true}
                                        onChange={(value) => this.onChangeData('timezone', value)}
                                    />
                                )}
                            </Form.Item> */}
                            {/* <Form.Item label={<IntlMessages id="sidebar.currency" />}>
                                        {getFieldDecorator("currency_id", {
                                            initialValue: destination ? destination.currency_id : null
                                        })(
                                            <BaseSelect
                                                options={currency}
                                                selected={destination ? destination.currency_id : null}
                                                defaultText="Select currency"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                showSearch={true}
                                                onChange={(value) => this.onChangeData('currency_id', value)}
                                            />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="destination.parent" />}>
                                        {getFieldDecorator("parent_id", {
                                            initialValue: destination ? destination.parent_id : ""
                                        })(
                                            <BaseSelect
                                                options={destinations}
                                                selected={destination ? destination.parent_id : ""}
                                                defaultText="Select destination parent..."
                                                filterOption={(input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                                showSearch={true}
                                            />
                                        )}
                                    </Form.Item> */}
                            <Form.Item label={<IntlMessages id="global.image" />}>
                                <InputChosseFile
                                    onChange={this.getValueChosseFile}
                                    limit={1}
                                    defautValue={dedfaultImage}
                                ></InputChosseFile>
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.location" />}>
                                {edit ? (
                                    <CustomPlacesAutoComplete
                                        address={this.state.address}
                                        onChange={this.onSetLocation}
                                        defaultPosition={{
                                            lat: destination.latitude,
                                            lng: destination.longitude
                                        }}
                                    ></CustomPlacesAutoComplete>
                                ) : (
                                        <CustomPlacesAutoComplete
                                            onChange={this.onSetLocation}
                                        ></CustomPlacesAutoComplete>
                                    )}
                            </Form.Item>
                            {/* </TabPane> */}
                            {/* <TabPane tab={<IntlMessages id="destination.intro" />} key="2"> */}
                            {/* <Form.Item {...formDesc}>
                                        {getFieldDecorator("intro", {
                                            initialValue:
                                                destination != null ? destination.intro || "" : ""
                                        })(
                                            <SunEditor
                                                setContents={destination != null ? destination.intro || "" : ""}
                                                placeholder="Please type here..."
                                                setOptions={{
                                                    buttonList: buttonList.complex
                                                }}
                                            />
                                        )}
                                    </Form.Item> */}
                            {/* </TabPane> */}
                            {/* <TabPane tab={<IntlMessages id="global.desc" />} key="3"> */}
                            {/* <Form.Item {...formDesc}>
                                        {getFieldDecorator("desc", {
                                            initialValue:
                                                destination != null ? destination.desc || "" : ""
                                        })(
                                            <SunEditor
                                                setContents={destination != null ? destination.desc || "" : ""}
                                                placeholder="Please type here..."
                                                setOptions={{
                                                    buttonList: buttonList.complex
                                                }}
                                            />
                                        )}
                                    </Form.Item> */}
                            {/* </TabPane> */}
                            {/* <TabPane tab={<IntlMessages id="destination.best_time_travel" />} key="4"> */}
                            {/* <Form.Item {...formDesc}>
                                        {getFieldDecorator("best_time_travel", {
                                            initialValue: destination ? destination.best_time_travel || "" : ""
                                        })(
                                            <SunEditor
                                                setContents={destination != null ? destination.best_time_travel || "" : ""}
                                                placeholder="Please type here..."
                                                setOptions={{
                                                    buttonList: buttonList.complex
                                                }}
                                            />
                                        )}
                                    </Form.Item> */}
                            {/* </TabPane> */}
                            {/* <TabPane tab={<IntlMessages id="global.gallery" />} key="5">
                                    <Form.Item {...formDesc}>
                                        <InputChosseFile
                                            key="images"
                                            onChange={this.getValueImage}
                                            defautValue={defaultImage}
                                        ></InputChosseFile>
                                    </Form.Item>
                                </TabPane> */}
                            {/* </Tabs> */}
                            <Row>
                                <Col span={24} style={{ textAlign: "right" }}>
                                    <Button
                                        type="default"
                                        onClick={() => this.props.onDestinationClose()}
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
                ) : null}
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        destinations: state.destination.listDestinationParent
    };
};
function mapDispatchToProps(dispatch) {
    return {
        getAllDestination: (filter, isPaginate, isDispatch) => dispatch(getAllDestination(filter, isPaginate, isDispatch))
    };
}

export default Form.create({ name: "destination" })(
    connect(mapStateToProps, mapDispatchToProps)(AddDestination)
);
