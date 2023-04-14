import { Table, Tag, DatePicker, Row, Select, Button, Modal, Col, message, Descriptions, InputNumber, Divider } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import NumberFormat from "react-number-format";
import moment from "moment";
import { OrderStatus } from "../../../components/OrderStatus";
import { searchDestination } from "../../../actions/DestinationActions";
import BtnResendMail from "../../../components/BtnResendMail";
import FilterBar from "../../../components/FilterBar";
import { StatusOrderFilter } from "../../../components/StatusOrderFilter";
import { priceInVn, processPayType, processBank, processPayStatus } from '../../../helpers/helpers';
// actions
import { getOrderPaymentInfo, cancelRouteOrder, confirmProofOfPayment } from '../../../actions/OrderActions';
import { getAllOrder, updateOrder, _exportOrder, handleCancel } from "../../../actions/TransportBookingAction";
import { SearchRoute } from "../../statistics/SearchRoute";
import { SearchSupplier } from "../../statistics/SearchSupplier";
import OrderDetail from "./orderDetail";
import { PayMethod } from "../../../components/PayMethod";
import { ApproveProofModal } from "../../../components/ApproveProofModal";

const { RangePicker } = DatePicker;

const { Option } = Select;

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
                search: "",
                supplier_id: {
                    type: "=",
                    value: "",
                },
                object_id: {
                    type: "=",
                    value: "",
                },
                cid: {
                    type: "=",
                }
            },
            loading: true,
            open: false,
            item: null,
            listAirport: [],
            paymentInfo: {},
            isShowPaymentModal: false,
            refundAmount: 0,
            currentorder: null,
            isShowProofModal: false,
            isShowOrderDetail: false
        }

        this.columns = [
            {
                title: <IntlMessages id="global.order_number" />,
                key: "order_number",
                sorter: true,
                fixed: true,
                dataIndex: "order_number",
                render: (text, record) => {
                    return (
                        <Button type="link" className="p-0" onClick={() => this.setState({ isShowOrderDetail: true, currentorder: record })}>
                            {record.order_number}
                        </Button>
                    );
                },
            },
            {
                title: <IntlMessages id="global.pay_method" />,
                key: "pay_method",
                dataIndex: "pay_method",
                align: 'center',
                render: (text, record) => {
                    return (
                        <PayMethod
                            methodCode={text}
                            hasPaymentProof={record.proof_of_payment}
                            paymentProofApproved={record.proof_approved_status}
                            onClickProofStatus={() => this.setState({ currentorder: record, isShowProofModal: true })}
                        />
                    );
                },
            },
            {
                title: <IntlMessages id="sidebar.route" />,
                dataIndex: "address",
                key: "address",
                width: '20%',
                render: (text, record) => (
                    <div>
                        {record.route_type == 1 ? <Tag color='geekblue'><IntlMessages id="global.route_onward" /></Tag> : <Tag color='green'><IntlMessages id="global.route_return" /></Tag>}
                        <p><IntlMessages id="global.airport" />: {record.airport_title}</p>
                        <p style={{ marginBottom: "0px" }}><IntlMessages id="global.place" />: {record.address}</p>
                    </div>
                )
            },
            {
                title: <IntlMessages id="sidebar.vehicle" />,
                dataIndex: "vehicle_title",
                key: "vehicle_title",
                width: 250,
                align: 'center',
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                align: 'center',
                key: 'status',
                render: (status, record) => (
                    <React.Fragment>
                        <OrderStatus status={status} />
                        {
                            status == 'ORDER_CANCELLED' ? (
                                <div>
                                    {record.refund_status ? <small>{record.refund_status == 1 ? `Đã hoàn ${priceInVn(record.refund_amount)}` : `Hoàn tiền thất bại`}</small> : null}
                                </div>
                            ) : null
                        }
                        {status == "ORDER_COMPLETED" ? record.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment><br />Có sử dụng dịch vụ</React.Fragment> : record.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment><br />Không sử dụng dịch vụ</React.Fragment> : null : null}
                    </React.Fragment>
                )
            },
            {
                title: <IntlMessages id="global.depart_time" />,
                dataIndex: "depart",
                key: "depart",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.depart).format("DD/MM/YYYY HH:mm")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="global.total" />,
                key: "total",
                dataIndex: "total",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.total} thousandSeparator={true} displayType="text" suffix=" đ" />

                    );
                },
            },
            {
                title: <IntlMessages id="global.customer" />,
                dataIndex: "c_firstname",
                render: (text, record) => `${text} ${record.c_lastname}`
            },
            {
                title: <IntlMessages id="global.commission" />,
                dataIndex: "discount",
                key: "discount",
                render: (text, record) => {
                    let discount = record.discount ? record.discount : 0;
                    return (
                        <NumberFormat value={+discount} thousandSeparator={true} displayType="text" suffix=" đ" />
                    );
                },
            },
            {
                title: <IntlMessages id="global.supplier" />,
                dataIndex: "sup_company",
            },
            {
                title: <IntlMessages id="global.order_created" />,
                dataIndex: "created_at",
                key: "created_at",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.created_at).format("DD/MM/YYYY HH:mm")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
            },
            {
                title: <IntlMessages id="global.action" />,
                dataIndex: "updated_at",
                render: (text, record) => (
                    <div>
                        <BtnResendMail order_id={record.id} />
                        {
                            (!record.status || record.status != 'ORDER_PENDING') && record.payment_info ? (
                                <React.Fragment>
                                    <br />
                                    <Button type="primary" size="small" className="mt-1" onClick={() => this.getOrderPayment(record.id)}>Xem thanh toán</Button>
                                </React.Fragment>
                            ) : null
                        }
                        {
                            record.status == 'ORDER_CANCELLED' && record.pay_status == "PAYMENT_SUCCESS" && record.refund_status != 1 && record.total > 0 ? (
                                <React.Fragment>
                                    <br />
                                    <Button type="danger" ghost size="small" className="mt-1" onClick={() => this.onRefundOrder(record)}>Hoàn tiền</Button>
                                </React.Fragment>
                            ) : null
                        }
                        {
                            record.status != 'ORDER_CANCELLED' && record.status != 'ORDER_CANCELLATION_PENDING' ? (
                                <React.Fragment>
                                    <br />
                                    <Button type="danger" size="small" className="mt-1" onClick={() => this.onCancelOrder(record)}>Huỷ đơn hàng</Button>
                                </React.Fragment>
                            ) : null
                        }
                    </div>

                ),
            },
        ];
    }

    handleConfirm = (data) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xác nhận đơn hàng này không?`,
            okText: 'Có',

            onOk: () => {
                this.setState({ loading: true }, async () => {
                    this.props.updateOrder(data.id);

                    this.setState({ loading: false });
                })
            },
            onCancel() { },
        })
    }

    openAlert(item) {
        this.setState({
            cItem: item
        }, () => {
            this.setState({
                modalVisible: true,

            })
        })
    }

    async componentDidMount() {
        try {
            await this.props._getAll(this.state.filter);
            let airport = await searchDestination({
                type: {
                    type: "=",
                    value: "airport",
                },
                paging: 0
            });
            this.setState({ loading: false, listAirport: airport.list })
        } catch (error) {
            this.setState({ loading: false })
        }

    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    filter = (value, name, type) => {
        if (type === "search") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        search: value,
                    },
                },
                async () => {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        } else {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                },
                async () => {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        }
    }

    filterDate = (value, name) => {
        console.log(value, name)
        if (name == "depart") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        depart_from: value[0],
                        depart_to: value[1]
                    },
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
        }
        if (name == "created") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        created_from: value[0],
                        created_to: value[1]
                    },
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
        }
    }

    exportExcel = () => {
        this.setState({
            ...this.state,
            loadingExport: true
        })
        _exportOrder(this.state.filter).then(res => {
            message.success("Xuất file thành công")
            this.setState({
                ...this.state,
                loadingExport: false
            })
        }).catch(err => {
            message.error("Có lỗi xảy ra, vui lòng thử lại")
            this.setState({
                ...this.state,
                loadingExport: false
            })
        })
    }


    filter2 = (value, name) => {
        this.setState(
            {
                ...this.state,
                loading: true,
                filter: {
                    ...this.state.filter,
                    [name]: value,
                },
            },
            async () => {
                await this.props._getAll(this.state.filter);
                this.setState({
                    ...this.state,
                    loading: false
                })
            }
        );
    }


    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
                loading: true,
                filter: {
                    ...this.state.filter,
                    sort: {
                        type: this.getOrder(sorter.order),
                        attr: sorter.columnKey,
                    },
                    paging: {
                        perpage: pagination.pageSize,
                        page: pagination.current,
                    },
                },
            },
            async () => {
                await this.props._getAll(this.state.filter);
                this.setState({
                    ...this.state,
                    loading: false
                })

            }
        );
    };

    setStateFalse() {
        this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            item: null,
            edit: false,
        });
    }

    onSave = async (data, id) => {
        this.setState({
            ...this.state,
            isSubmiting: true,
        });
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
                this.setStateFalse();
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                });
            }
        }
    };

    hideModal = () => {
        this.setState({
            modalVisible: false,
            cItem: null
        })
    }

    onHandleCancel = () => {
        this.setState({ cancelBtnLoading: true })
        this.props.handleCancel(this.state.cItem.order_number).then(res => {
            this.setState({ cancelBtnLoading: false })
            this.hideModal();
        })
    }

    async getOrderPayment(orderId) {
        var info = await this.props.getOrderPaymentInfo(orderId);
        this.setState({ paymentInfo: info }, () => {
            this.setState({ isShowPaymentModal: true });
        });
    }

    onClosePaymentModal() {
        this.setState({ isShowPaymentModal: false, paymentInfo: {} });
    }

    onRefundOrder(order) {
        this.setState({ refundAmount: order.refund_amount }, () => {
            Modal.confirm({
                title: 'Bạn chắc chắn muốn hoàn tiền cho đơn hàng này?',
                content: (
                    <div>
                        <div>Bạn cần chuyển khoản số tiền trị giá như sau cho khách đã đặt đơn hàng {order.order_number}:</div>
                        <InputNumber
                            defaultValue={this.state.refundAmount || 0}
                            formatter={value => `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            className="w-100 mt-3"
                            onChange={(value) => this.setState({ refundAmount: value })}
                        />
                    </div>
                ),
                okText: "Hoàn tiền",
                onOk: async () => {
                    await this.props.handleCancel(order.order_number, this.state.refundAmount);
                    await this.props._getAll(this.state.filter);
                },
                onCancel: () => {
                    this.setState({ refundAmount: 0 })
                }
            })
        })

    }

    onCancelOrder(order) {
        Modal.confirm({
            title: `Bạn chắc chắn muốn huỷ đơn hàng ${order.order_number}?`,
            okText: "Huỷ đơn hàng",
            cancelText: "Không huỷ",
            okButtonProps: {
                type: 'danger'
            },
            onOk: async () => {
                await this.props.cancelRouteOrder(order.id);
                await this.props._getAll(this.state.filter);
            }
        })
    }

    onCloseApproveProofModal() {
        this.setState({ isShowProofModal: false, currentorder: null });
    }

    async onConfirmProof(type) {
        var data = {
            is_confirmed: type,
            payment_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        await this.props.confirmProofOfPayment(this.state.currentorder.id, data);
        this.onCloseApproveProofModal();
        await this.props._getAll(this.state.filter);
    }

    render() {
        const { loading, listAirport, isShowPaymentModal, paymentInfo, currentorder, isShowProofModal, isShowOrderDetail } = this.state;
        const { list, paging, config } = this.props;

        const carType = this.props.config && this.props.config.car_type ? this.props.config.car_type : [];


        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<React.Fragment><IntlMessages id="sidebar.orders" />{" "}<IntlMessages id="sidebar.transfer" /></React.Fragment>}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <Row type="flex" justify="space-between">

                                <Col>
                                </Col>

                                <Col style={{ padding: "16px 0px" }}>
                                    <Button
                                        type="primary"
                                        onClick={this.exportExcel}
                                        loading={this.state.loadingExport}
                                        size="large"
                                    >
                                        <IntlMessages id="global.export" />
                                    </Button>
                                </Col>
                            </Row>
                            <FilterBar
                                textSearchPlaceholder="Mã BK, Tên khách hàng"
                                onFilter={this.filter}
                                data={[
                                    {
                                        name: "status",
                                        data: StatusOrderFilter,
                                        placeholder: "Chọn trạng thái",
                                    },
                                ]}
                            >
                                <React.Fragment>
                                    <Col sm={{ span: 6 }} xs={{ span: 24 }} >
                                        <Select
                                            value={this.state.filter.airport}
                                            style={{ width: "100%" }}
                                            placeholder={<IntlMessages id="global.select_aiport" />}
                                            onChange={(v) => this.filter2(v, "airport")}
                                            allowClear
                                        >
                                            {listAirport && listAirport.length ?
                                                listAirport.map(item => (
                                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                                ))
                                                : null
                                            }
                                        </Select>
                                    </Col>
                                    <Col sm={{ span: 6 }} xs={{ span: 24 }} >
                                        <Select
                                            value={this.state.filter.vehicle_type}
                                            style={{ width: "100%" }}
                                            placeholder={<IntlMessages id="global.select_vehicle_type" />}
                                            onChange={(v) => this.filter2(v, "vehicle_type")}
                                            allowClear
                                        >
                                            {carType.map(item => (
                                                <Option value={item.ma}>{item.title}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </React.Fragment>
                            </FilterBar>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                                <span> Ngày đi:&nbsp;</span>
                                <RangePicker
                                    allowEmpty={[true, true]}
                                    format="YYYY-MM-DD"
                                    onChange={(date, dateStr) => this.filterDate(dateStr, "depart")}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                />
                                <span>&nbsp;  Ngày đặt:&nbsp; </span>
                                <RangePicker
                                    allowEmpty={[true, true]}
                                    format="YYYY-MM-DD"
                                    onChange={(date, dateStr) => this.filterDate(dateStr, "created")}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                                <SearchSupplier
                                    supplier_id={this.state.filter.supplier_id.value}
                                    onChange={(v) => this.filter(v, 'supplier_id')}
                                />
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <SearchRoute
                                    supplier_id={this.state.filter.supplier_id.value}
                                    onChange={(v) => this.filter(v, 'object_id')}
                                    object_id={this.state.filter.object_id.value}
                                />
                            </div>

                            <Table
                                tableLayout="auto"
                                columns={this.columns}
                                dataSource={list}
                                onChange={this.onChangTable}
                                rowKey="id"
                                size="small"
                                loading={loading}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    total: paging.count,
                                }}
                                scroll={{
                                    x: true
                                }}
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <Modal
                    title="Xử lý đơn hàng bị huỷ"
                    visible={this.state.modalVisible}
                    onOk={this.onHandleCancel}
                    onCancel={this.hideModal}
                    okText="OK"
                    cancelText="Huỷ"
                    okButtonProps={{
                        disabled: this.state.cancelBtnLoading,
                        loading: this.state.cancelBtnLoading
                    }}
                >
                    {this.state.cItem ?
                        <React.Fragment>
                            <p>Đơn hàng <strong>{this.state.cItem.order_number || ''} </strong>đã bị huỷ</p>
                            <p>Bạn cần chuyển khoản số tiền <strong> {<NumberFormat value={+ this.state.cItem.refund_amount} thousandSeparator={true} displayType="text" suffix=" đ" /> || ''} </strong> cho khách đã huỷ đơn đặt hàng này.</p>
                            <p>{`Bạn chắc chắn muốn cập nhật trạng thái xử lý thành công?`}</p>
                        </React.Fragment>
                        : null}
                </Modal>

                {
                    paymentInfo ? (
                        <Modal
                            title={`Thông tin thanh toán của đơn hàng ${paymentInfo.invoiceNo}`}
                            visible={isShowPaymentModal}
                            footer={null}
                            onCancel={() => this.onClosePaymentModal()}
                        >
                            <Descriptions column={1}>
                                <Descriptions.Item label="Mã giao dịch">{paymentInfo.trxId}</Descriptions.Item>
                                <Descriptions.Item label="Số tiền">{priceInVn(paymentInfo.amount)}</Descriptions.Item>
                                <Descriptions.Item label="Hình thức thanh toán">{processPayType(paymentInfo.payType)}</Descriptions.Item>
                                <Descriptions.Item label="Thanh toán lúc">{moment(`${paymentInfo.trxDt}${paymentInfo.trxTm}`, 'YYYYMMDDHHmmss').format('HH:mm:ss MM/DD/YYYY')}</Descriptions.Item>
                                <Descriptions.Item label="Tình trạng giao dịch">{processPayStatus(parseInt(paymentInfo.status))}</Descriptions.Item>
                                {
                                    paymentInfo.cancelDt ? (
                                        <React.Fragment>
                                            <Descriptions.Item label="Ngày hoàn tiền">{moment(`${paymentInfo.cancelDt}${paymentInfo.cancelTm}`, 'YYYYMMDDHHmmss').format('HH:mm:ss MM/DD/YYYY')}</Descriptions.Item>
                                            <Descriptions.Item label="Số tiền còn lại">{priceInVn(paymentInfo.remainAmount)}</Descriptions.Item>
                                        </React.Fragment>
                                    ) : null
                                }
                                <Descriptions.Item label="Số thẻ">{paymentInfo.cardNo}</Descriptions.Item>
                                <Descriptions.Item label="Ngân hàng">{processBank(paymentInfo.bankId)}</Descriptions.Item>
                            </Descriptions>
                        </Modal>
                    ) : null
                }
                <Modal
                    title={`Chi tiết đơn hàng ${this.state.currentorder ? this.state.currentorder.order_number : ""}`}
                    // visible={!!this.state.currentorder}
                    visible={isShowOrderDetail}
                    destroyOnClose
                    footer={false}
                    width={1024}
                    closable
                    onCancel={() => this.setState({ isShowOrderDetail: false, currentorder: null })}
                >
                    <OrderDetail
                        id={this.state.currentorder ? this.state.currentorder.id : null}
                    />
                </Modal>
                {
                    currentorder ? (
                        <ApproveProofModal
                            visible={isShowProofModal}
                            onCancel={() => this.onCloseApproveProofModal()}
                            onApprove={() => this.onConfirmProof(1)}
                            onReject={() => this.onConfirmProof(0)}
                            proof={currentorder.proof_of_payment}
                            orderNumber={currentorder.order_number}
                            showButtons={currentorder.proof_approved_status != 1}
                        />
                    ) : null
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.transportOrder.list,
        config: state.config,
        paging: state.transportOrder.paging,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAll: (filter) => dispatch(getAllOrder(filter)),
        updateOrder: (id) => dispatch(updateOrder(id)),
        handleCancel: (order_number, refund_amount) => dispatch(handleCancel(order_number, refund_amount)),
        cancelRouteOrder: (orderId) => dispatch(cancelRouteOrder(orderId)),
        getOrderPaymentInfo: (id) => dispatch(getOrderPaymentInfo(id)),
        confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reservation));