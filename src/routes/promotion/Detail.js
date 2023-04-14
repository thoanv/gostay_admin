import { Table, Button, Icon, Col, Form, Input, InputNumber, Row, DatePicker, Spin, Select, Upload, Modal } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Add from "./Add";
import { _getAll, _create, _update, _delete, _getDetail, _getAllRoom, _getAllTicket, _getAllRoute, _getAllTour, _createPromotionProduct, _getAllPromotionProduct, _deletePromotionProduct } from "../../actions/PromotionAction";
import { debounce } from "lodash";
import BaseSelect from "Components/Elements/BaseSelect";
import InputChosseFile from "../fileManager/InputChosseFile";
const { confirm } = Modal;

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
    { title: <span><IntlMessages id="global.published" /></span>, id: "1" },
    { title: <span><IntlMessages id="global.unpublished" /></span>, id: "2" },
]

const productTypeOption = [
    // { title: "Tour", id: "1" },
    // { title: "Ticket", id: "1" },
    { title: "Transport", id: "3" },
    { title: "Stay", id: "4" },
]


class PromotionDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isSubmiting: false,
            edit: false,
            productType: "1",
            list: [],
            loadingProduct: false,
            image: ""
        };

        this.columns = [
            // {
            //     key: "created_at",
            //     title: "STT",
            //     dataIndex: "created_at",
            //     align: "left",
            //     width: "5%",
            //     render: (text, record, rest) => {
            //         let { filter } = this.state;
            //         let index = rest + 1;
            //         return index;
            //     }

            // },
            {
                key: "product_id",
                title: "ID",
                dataIndex: "product_id",
                width: "15%",
                align: "center",
            },
            {
                title: <IntlMessages id="global.title" />,
                dataIndex: "title",
                key: "title",
                width: "50%",
            },
            {
                title: <IntlMessages id="global.type" />,
                dataIndex: "type_product",
                key: "type_product",
                render: (text, record, rest) => {
                    switch (text.toString()) {
                        case "1": return "Tour";
                        case "2": return "Ticket";
                        case "3": return "Route";
                        case "4": return "Room";
                        default: return "";
                    }
                },
            },
            {
                key: "updated_at",
                title: <IntlMessages id="global.actions" />,
                dataIndex: "updated_at",
                render: (text, record, rest) => (
                    <Button shape="circle" type="danger" onClick={() => this.onDelete(record.id)}>
                        <Icon type="delete" />
                    </Button>
                )
            },
        ];

    }


    async componentDidMount() {

        try {
            let { id } = this.props.match.params
            await this.props._getDetail(id);
            this.props._getAllPromotionProduct(id);
            let res = await _getAllRoom();

            this.setState({
                ...this.state,
                loading: false,
                list: res && res.list ? res.list : []
            });
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }

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

                this.onSave(
                    record,
                    this.props.record ? this.props.record.id : null
                )
            }
        });
    };

    onSave = (data, id) => {
        console.log(data)
        this.setState({
            ...this.state,
            isSubmiting: true
        });
        var dataSubmit = { ...data, id: id };
        this.props
            ._update(dataSubmit)
            .then(res => {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    isOpenModal: false,
                    current_record: null,
                    edit: false
                });
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                });
            });
    };
    //add  end


    onChangeProductType = (v) => {
        let { id } = this.props.match.params


        console.log('v', v);
        this.setState({
            ...this.state,
            productType: v,
            loadingProduct: true
        }, async () => {
            try {
                switch (v) {
                    // case "1": {
                    //     let res = await _getAllTour()
                    //     this.setState({
                    //         ...this.state,
                    //         list: res && res.list ? res.list : [],
                    //         loadingProduct: false
                    //     });
                    //     break;
                    // }
                    // case "1": {
                    //     let res = await _getAllTicket()
                    //     this.setState({
                    //         ...this.state,
                    //         list: res && res.list ? res.list : [],
                    //         loadingProduct: false
                    //     });
                    //     break;
                    // }
                    case "4": {
                        let res = await _getAllRoom()
                        await this.props._getAllPromotionProduct(id);
                        this.setState({
                            ...this.state,
                            list: res && res.list ? res.list : [],
                            loadingProduct: false
                        });
                        break;
                    }
                    case "3": {

                        let res = await _getAllRoute()
                        await this.props._getAllPromotionProduct(id);
                        this.setState({
                            ...this.state,
                            list: res && res.list ? res.list : [],
                            loadingProduct: false
                        });
                        break;
                    }
                    default: {
                        this.setState({
                            ...this.state,
                            loadingProduct: false
                        });
                        break;
                    }
                }
            } catch (error) {
                this.setState({
                    ...this.state,
                    loadingProduct: false
                });
            }
        })
    }

    onSearchProduct = async (v) => {
        let { productType } = this.state;
        let filter = {
            search: v
        }
        try {
            switch (productType) {
                // case "1": {
                //     let res = await _getAllTour(filter)
                //     this.setState({
                //         ...this.state,
                //         list: res && res.list ? res.list : [],
                //     });
                //     break;
                // }
                // case "1": {
                //     let res = await _getAllTicket(filter)
                //     this.setState({
                //         ...this.state,
                //         list: res && res.list ? res.list : [],
                //     });
                //     break;
                // }
                case "4": {
                    let res = await _getAllRoom(filter)
                    this.setState({
                        ...this.state,
                        list: res && res.list ? res.list : [],
                    });
                    break;
                }
                case "3": {
                    let res = await _getAllRoute(filter)
                    this.setState({
                        ...this.state,
                        list: res && res.list ? res.list : [],
                    });
                    break;
                }
                default: {
                    this.setState({
                        ...this.state,
                    });
                    break;
                }
            }
        } catch (error) {
        }
    }

    onSelectProduct = (v, option) => {
        let data = {
            product_id: v,
            promotion_id: this.props.match.params.id,
            type_product: this.state.productType,
        }
        this.props._createPromotionProduct(data, option.props.title)

    }


    onDelete(id) {
        this.setState({
            ...this.state,
            isSubmiting: true
        }, async () => {
            try {
                await this.props._deletePromotionProduct(id);
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })

            }
        })
    }

    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };

    render() {

        const { loading, isSubmiting, loadingProduct } = this.state;
        const { list } = this.state;
        const {
            record,
            promotion_product
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const dedfaultImage = record && record.image ? [{ name: record.image, path_relative: record.image }] : [];
        console.log("dedfaultImage", dedfaultImage)

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.promotionDetail" />}
                        match={this.props.match}
                    />
                    <Spin spinning={loading}>

                        <div className="row">
                            <RctCollapsibleCard colClasses="col-6">

                                <div>
                                    <h2><IntlMessages id="promotion.information" /></h2>
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
                                        <Form.Item label={<IntlMessages id="promotion.amount" />}>
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
                                        </Form.Item>
                                        <Form.Item label={<IntlMessages id="promotion.style" />}>
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
                                        <Form.Item label={<IntlMessages id="global.status" />} >
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
                                            {loading ? null :
                                                <InputChosseFile
                                                    onChange={this.getValueChosseFile}
                                                    limit={1}
                                                    defautValue={dedfaultImage}
                                                ></InputChosseFile>
                                            }
                                        </Form.Item>

                                        <div className="d-flex justify-content-end">
                                            <Button
                                                style={{ marginLeft: 8 }}
                                                type='default'
                                                onClick={() => this.props.form.resetFields()}
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
                                        </div>
                                    </Form>
                                </div>
                            </RctCollapsibleCard>
                            <RctCollapsibleCard colClasses="col-6">
                                <div style={{}}>
                                    {/* <h2><IntlMessages id="promotion.items" /></h2>
                                    <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                                        <div style={{ fontSize: "16px", fontWeight: "500" }} className="w-30">
                                            <IntlMessages id="promotion.choose_product" />
                                        </div>
                                        <Select
                                            // style={{ width: '80%' }}
                                            className="w-70"
                                            placeholder="Select a product type"
                                            showSearch={true}
                                            allowClear={true}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={this.state.productType}
                                            onChange={this.onChangeProductType}
                                        >
                                            {productTypeOption.map(item => (
                                                <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                                            ))}
                                        </Select>
                                    </div> */}
                                    {/* <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                                        <div style={{ fontSize: "16px", fontWeight: "500" }} className="w-30">
                                            <IntlMessages id="promotion.choose_item" />
                                        </div>
                                        <Select
                                            onSelect={this.onSelectProduct}
                                            loading={loadingProduct}
                                            className="w-70"
                                            placeholder="Select items product to apply the promotion"
                                            showSearch={true}
                                            allowClear={true}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onSearch={this.onSearchProduct}
                                        >
                                            {list && list.length ?
                                                list.map(item => (
                                                    <Select.Option key={item.id} value={item.id} title={item.title}>{item.title}</Select.Option>
                                                ))
                                                : null
                                            }
                                        </Select>
                                    </div> */}
                                    <h2>Danh sách sản phẩm đang áp dụng</h2>
                                    <Table
                                        columns={this.columns}
                                        dataSource={promotion_product}
                                        tableLayout="auto"
                                        rowKey="id"
                                        size="small"
                                        // scroll={{ y: "80vh" }}
                                        pagination={false}
                                    />
                                </div>


                            </RctCollapsibleCard>
                        </div>
                    </Spin>

                </div>

            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        auth: state.authUser.data,
        record: state.promotion.detail,
        promotion_product: state.promotion.promotion_product
    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: (filter) => dispatch(_getAll(filter)),
        _create: data => dispatch(_create(data)),
        _update: data => dispatch(_update(data)),
        _delete: data => dispatch(_delete(data)),
        _getDetail: id => dispatch(_getDetail(id)),
        _createPromotionProduct: (data, title) => dispatch(_createPromotionProduct(data, title)),
        _getAllPromotionProduct: id => dispatch(_getAllPromotionProduct(id)),
        _deletePromotionProduct: id => dispatch(_deletePromotionProduct(id)),


    };
};
export default Form.create({ name: "add" })(withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PromotionDetail)
));
