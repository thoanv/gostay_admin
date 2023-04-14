import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Button, Col, Form, Input, Modal, Radio, Row, InputNumber } from "antd";
import PropTypes from "prop-types";
import BaseSelect from "../../components/Elements/BaseSelect";
import SunEditor, { buttonList } from "suneditor-react";
// actions
import { getAllDestination } from "../../actions/DestinationActions";
import { _getAll as getAllProperties } from "../../actions/PropertyAction";
import { _getAll as getAllCars } from "../../actions/CarAction";
import _ from "lodash";
import {getAllHotel} from "Actions/WidgetActions";
import {_getAllManageVoucher} from "Actions/ManageVoucherActions";

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

const ruleOptions = [
    { id: 'newest', title: 'Mới nhất' },
    { id: 'highest_rating', title: 'Đánh giá cao' },
    { id: 'most_booked', title: 'Được đặt nhiều nhất' },
    { id: 'custom', title: 'Tuỳ chỉnh' }
]

class AddWidget extends Component {
    static propTypes = {
        widget: PropTypes.object,
        onSave: PropTypes.func,
        open: PropTypes.bool,
        onClose: PropTypes.func,
        edit: PropTypes.bool
    };

    state = {
        type: null,
        rule: 'custom',
        tourFilter: {
            sort: {
                type: "desc",
                attr: "title"
            },
            paging: {
                page: 1
            }
        },
        destinationFilter: {
            sort: {
                type: "desc",
                attr: "title"
            },
            paging: {
                page: 1
            }
        }
    };

    componentDidMount() {
        this.props.getAllProperties();
        this.props.getAllDestination();
        this.props.getAllCars();
        this.props.getAllHotels();
        this.props.getAllManageVoucher();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (this.props.widget && nextProps.widget) {
            if (this.props.widget.id != nextProps.widget.id) {
                this.setState({ type: nextProps.widget.type, rule: nextProps.widget.rule || 'custom' });
            }
        } else {
            if (this.props.widget != nextProps.widget) {
                if (nextProps.widget) {
                    this.setState({ type: nextProps.widget.type, rule: nextProps.widget.rule || 'custom' });
                } else {
                    console.log(nextProps)
                    this.setState({ type: null, rule: 'custom' });
                }
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var widget = { ...values };

                if (widget.type == 'DESTINATION') {
                    widget.ids = widget.destination;
                } else {
                    if (widget.type == 'STAY') {
                        const {  hotel } = this.props;
                        const ids = hotel.map(e => e.id);
                        widget.ids = ids.slice(0,widget.quantity);
                    } else if (widget.type == 'CAR') {
                        widget.ids = widget.car;
                    } else if (widget.type == 'NEW_PRODUCT') {

                        widget.ids = {
                            'combo': widget.combo ? widget.combo : [],
                            'tour': widget.tour ? widget.tour : [],
                            'voucher': widget.voucher ? widget.voucher : [],
                            'hotel': widget.hotel ? widget.hotel : []
                        }
                    } else if (widget.type == 'TRADEMARK') {
                        widget.ids = widget.trademark
                    }
                }
                if(widget.type == 'BLOG'){
                    widget.ids = widget.blog ? widget.blog : []
                    
                }
                if(widget.rule != 'custom') {
                    const { combo, tour, hotel, voucher, trademark } = this.props;
                    if(widget.type == 'TRADEMARK') {
                        widget.ids = 
                            trademark ? trademark.slice(0, widget.quantity).map(x => x.id) : []
                    }
                    if(widget.type == 'NEW_PRODUCT') {

                        widget.ids = {
                            'combo': combo ? combo.slice(0, widget.quantity).map(x => x.id) : [],
                            'tour': tour ? tour.slice(0, widget.quantity).map(x => x.id) : [],
                            'voucher': voucher ? voucher.slice(0, widget.quantity).map(x => x.id) : [],
                            'hotel': hotel ? hotel.slice(0, widget.quantity).map(x => x.id) : []
                        }
                    }
                }
                delete widget.destination;
                delete widget.car;
                delete widget.stay;
                delete widget.combo;
                delete widget.tour;
                delete widget.hotel;
                delete widget.voucher;
                delete widget.trademark;
                delete widget.blog;
                widget.ids = JSON.stringify(widget.ids);
                this.props.onSave(widget);
            }
        });
    };


    onSearchDestination = _.debounce((value) => {
        // this.setState(
        //     {
        //         destinationFilter: {
        //             ...this.state.destinationFilter,
        //             title: {
        //                 type: "like",
        //                 value: value
        //             }
        //         }
        //     },
        //     () => {

        //     }
        // );

        this.props.getAllDestination({
            ...this.state.destinationFilter,
            title: {
                type: "like",
                value: value
            }
        });
    }, 300);

    onSearchProperties = _.debounce((keyword) => {
        this.props.getAllProperties({
            paging: {
                perpage: 15,
                page: 1,
            },
            search: keyword
        });
    }, 500);

    render() {
        const { widget, open, onClose, loading, combo, tour, hotel, voucher,destinations, properties, cars, config, trademark, blog } = this.props;
        var { type, rule } = this.state;
        voucher.map(e => {
            e.title = e.name
            return e;
        });
        const { getFieldDecorator } = this.props.form;
        const typeOptions = config.widgets.map(widget => {
            return {
                id: widget,
                title: <IntlMessages id={`global.${widget.toLowerCase()}`} />
            }
        });

        var elementInput = null;
        if (rule == 'custom') {
            if (type == 'DESTINATION') {
                elementInput = (
                    <Form.Item label={<IntlMessages id="global.destination" />}>
                        {getFieldDecorator("destination", {
                            rules: [
                                {
                                    required: true,
                                    message: <IntlMessages id="global.required" />
                                }
                            ],
                            initialValue: widget
                                ? widget.ids
                                    ? JSON.parse(widget.ids)
                                    : []
                                : []
                        })(
                            <BaseSelect
                                mode="multiple"
                                showSearch
                                onSearch={this.onSearchDestination}
                                options={destinations}
                                defaultText="Chọn một option"
                            />
                        )}
                    </Form.Item>
                );
            } else if (type == 'STAY') {
                elementInput = (
                    <Form.Item label={<IntlMessages id="global.stay" />}>
                        {getFieldDecorator("stay", {
                            rules: [
                                {
                                    required: true,
                                    message: <IntlMessages id="global.required" />
                                }
                            ],
                            initialValue: widget
                                ? widget.ids
                                    ? JSON.parse(widget.ids)
                                    : []
                                : []
                        })(
                            <BaseSelect
                                mode="multiple"
                                showSearch
                                onSearch={this.onSearchProperties}
                                options={hotel ? hotel : []}
                                defaultText="Chọn một option"
                            />
                        )}
                    </Form.Item>
                );
            } else if (type == 'CAR') {
                elementInput = (
                    <Form.Item label={<IntlMessages id="global.car" />}>
                        {getFieldDecorator("car", {
                            rules: [
                                {
                                    required: true,
                                    message: <IntlMessages id="global.required" />
                                }
                            ],
                            initialValue: widget
                                ? widget.ids
                                    ? JSON.parse(widget.ids)
                                    : []
                                : []
                        })(
                            <BaseSelect
                                mode="multiple"
                                showSearch
                                options={cars}
                                defaultText="Chọn một option"
                            />
                        )}
                    </Form.Item>
                );
            } else if(type == 'NEW_PRODUCT') {
                const ids = widget && widget.ids ? JSON.parse(widget.ids) : [];
                elementInput = (
                    <React.Fragment>
                        <Form.Item label={<IntlMessages id="sidebar.combo" />}>
                        {getFieldDecorator("combo", {
                            initialValue: widget
                                ? ids.combo
                                : []
                        })(
                        <BaseSelect
                                    mode="multiple"
                                    showSearch
                                    options={combo ? combo : []}
                                />
                                )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="sidebar.hotel" />}>
                        {getFieldDecorator("hotel", {
                            initialValue: widget
                                ? ids.hotel
                                : []
                        })(
                        <BaseSelect
                                    mode="multiple"
                                    showSearch
                                    options={hotel ? hotel : []}
                                />
                                )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="sidebar.voucher" />}>
                            {getFieldDecorator("voucher", {
                            initialValue: widget
                                ? ids.voucher
                                : []
                        })(
                        <BaseSelect
                                    mode="multiple"
                                    showSearch
                                    options={voucher ? voucher : []}
                                />
                                )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="sidebar.tour" />}>
                            {getFieldDecorator("tour",{
                            initialValue: widget
                                ? ids.tour
                                : []
                        })(
                        <BaseSelect
                                    mode="multiple"
                                    showSearch
                                    options={tour ? tour : []}
                                />
                                )}
                        </Form.Item>
                    </React.Fragment>
                    
                );
            } else if(type == 'TRADEMARK') {
                elementInput = (<Form.Item label={<IntlMessages id="global.trademark" />}>
                        {getFieldDecorator("trademark", {
                            rules: [
                                {
                                    required: true,
                                    message: <IntlMessages id="global.required" />
                                }
                            ],
                            initialValue: widget
                                ? widget.ids
                                    ? JSON.parse(widget.ids)
                                    : []
                                : []
                        })(
                            <BaseSelect
                                mode="multiple"
                                showSearch
                                options={trademark}
                            />
                        )}
                    </Form.Item>
                )
            }
        }
        return (
            <React.Fragment>
                {open ? (
                    <Modal
                        title={widget ? <IntlMessages id="widget.edit" /> : <IntlMessages id="widget.add" />}
                        toggle={onClose}
                        visible={open}
                        closable={false}
                        footer={null}
                        width="50%"
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label={<IntlMessages id="global.title" />}>
                                {getFieldDecorator("title", {
                                    rules: [
                                        {
                                            required: true,
                                            message: <IntlMessages id="global.required" />
                                        }
                                    ],
                                    initialValue: widget ? widget.title : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.code" />}>
                                {getFieldDecorator("code", {
                                    rules: [
                                        {
                                            required: true,
                                            message: <IntlMessages id="global.required" />
                                        }
                                    ],
                                    initialValue: widget ? widget.code : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.type" />}>
                                {getFieldDecorator("type", {
                                    rules: [
                                        {
                                            required: true,
                                            message: <IntlMessages id="global.required" />
                                        }
                                    ],
                                    initialValue: widget ? widget.type : ""
                                })(
                                    <BaseSelect
                                        options={typeOptions}
                                        defaultText="Chọn một option"
                                        onChange={value => this.setState({ type: value })}
                                    />
                                )}
                            </Form.Item>
                            {
                                type == 'VIDEO' ? (
                                    <Form.Item label={<IntlMessages id="global.video" />}>
                                        {getFieldDecorator("video_url", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: <IntlMessages id="global.required" />
                                                }
                                            ],
                                            initialValue: widget ? widget.video_url : ""
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                ) : null
                            }
                            {
                                type == 'BLOG' ? (
                                    <Form.Item label={<IntlMessages id="global.blog_cate" />}>
                                        {getFieldDecorator("blog", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: <IntlMessages id="global.required" />
                                                }
                                            ],
                                            initialValue: widget
                                                ? widget.ids
                                                    ? JSON.parse(widget.ids)
                                                    : []
                                                : []
                                                        })(
                                            <BaseSelect
                                                mode="multiple"
                                                showSearch
                                                options={blog}
                                            />
                                        )}
                                    </Form.Item>
                                ) : null
                            }
                            {
                                type != 'CUSTOM' && type != 'VIDEO' && type != 'BLOG' ? (
                                    <React.Fragment>
                                        <Form.Item label={<IntlMessages id="global.rule" />}>
                                            {getFieldDecorator("rule", {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: <IntlMessages id="global.required" />
                                                    }
                                                ],
                                                initialValue: widget && widget.rule ? widget.rule : "custom"
                                            })(
                                                <BaseSelect
                                                    options={ruleOptions}
                                                    defaultText="Chọn một option"
                                                    onChange={value => this.setState({ rule: value })}
                                                />
                                            )}
                                        </Form.Item>

                                        {
                                            rule == 'custom' ? elementInput : (
                                                <Form.Item label={<IntlMessages id="global.quantity" />}>
                                                    {getFieldDecorator("quantity", {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.required" />
                                                            }
                                                        ],
                                                        initialValue: widget ? widget.quantity : ""
                                                    })(
                                                        <InputNumber style={{ width: '100%' }} />
                                                    )}
                                                </Form.Item>
                                            )
                                        }
                                    </React.Fragment>
                                ) : null
                            }

                            <Form.Item label={<IntlMessages id="global.status" />}>
                                {getFieldDecorator("status", {
                                    initialValue: widget ? (widget.status ? 1 : 0) : 1
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
                            <Form.Item label={<IntlMessages id="global.content" />}>
                                {getFieldDecorator("content", {
                                    rules: [
                                        {
                                            required: false
                                        }
                                    ],
                                    initialValue: widget ? widget.content : ""
                                })(
                                    <SunEditor
                                        setContents={widget ? widget.content : ""}
                                        placeholder="Please type here..."
                                        setOptions={{
                                            buttonList: buttonList.complex
                                        }}
                                    />
                                )}
                            </Form.Item>

                            <Row>
                                <Col span={24} style={{ textAlign: "right" }}>
                                    <Button
                                        type="danger"
                                        ghost
                                        onClick={() => this.props.onClose()}
                                    >
                                        <IntlMessages id='global.cancel' />
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ marginLeft: 8 }}
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        <IntlMessages id='global.submit' />
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

function mapStateToProps(state) {
    return {
        destinations: state.destination.listDestination,
        properties: state.property.list,
        cars: state.car.list,
        hotels: state.hotel,
        config: state.config,
        combo: state.widget.combo,
        blog: state.widget.blog,
        tour: state.widget.tour,
        voucher: state.manageVoucher.list,
        hotel: state.widget.hotel,
        trademark: state.widget.trademark
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllProperties: (filter, paginate) => dispatch(getAllProperties(filter, paginate)),
        getAllDestination: (filter, paginate) => dispatch(getAllDestination(filter, paginate)),
        getAllCars: filter => dispatch(getAllCars(filter)),
        getAllHotels: filter => dispatch(getAllHotel(filter)),
        getAllManageVoucher: (filter) => dispatch(_getAllManageVoucher(filter)),

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create({ name: "widget" })(AddWidget));
