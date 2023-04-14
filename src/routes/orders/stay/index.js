import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { Table, Form, DatePicker, Button, Modal, Row, Col, message, Select, Divider, Descriptions, InputNumber } from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { OrderStatus } from "../../../components/OrderStatus";
import NumberFormat from "react-number-format";
import BtnResendMail from "../../../components/BtnResendMail";
import { StatusOrderFilter } from "../../../components/StatusOrderFilter";
import FilterBar from "../../../components/FilterBar";
import debounce from "lodash.debounce";
import { priceInVn, processPayType, processBank, processPayStatus } from '../../../helpers/helpers';
// actions
import { getOrderPaymentInfo, cancelStayOrder, confirmProofOfPayment } from '../../../actions/OrderActions';
import { getListOrder, _exportOrder, } from "../../../actions/OrderStay";
import { _requestGetAll as getAllProperties } from "../../../actions/PropertyAction";
import { handleCancel } from "../../../actions/OrderStay";
import { SearchSupplier } from "../../statistics/SearchSupplier";
import { SearchRoom } from "../../statistics/SearchRoom";
import { PayMethod } from "../../../components/PayMethod";
import { ApproveProofModal } from "../../../components/ApproveProofModal";

const { RangePicker } = DatePicker;


class StayOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
                type: {
                    type: "=",
                    value: 0,
                },
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
            selectedRowKeys: [],
            open: false,
            openAssign: false,
            current_assign: null,
            propertyFilter: {
                paging: {
                    perpage: 15,
                    page: 1,
                },
                search: ""
            },
            listProperty: [],
            order_current: null,
            loading: true,
            modalVisible: false,
            cItem: {},
            cancelBtnLoading: false,
            paymentInfo: {},
            isShowPaymentModal: false,
            refundAmount: 0,
            isShowProofModal: false,
            currentOrder: null
        };

    }

    columns = [
        {
            title: <IntlMessages id="global.order_number" />,
            key: "order_number",
            fixed: true,
            render: (record) => (
                <p
                    onClick={() => {
                        this.props.history.push(`/app/orders/stay/${record.id}`)
                    }}
                    style={{ color: "blue", cursor: "pointer", margin: 0 }}
                >
                    {record.order_number}
                </p>
            ),
            sorter: true,
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
                        onClickProofStatus={() => this.setState({currentOrder: record, isShowProofModal: true})}
                    />
                );
            },
        },
        {
            title: <IntlMessages id="property.title" />,
            // dataIndex: "property_title",
            key: "property_title",
            width: "200px",
            render: (record) => {
                return (<React.Fragment><span>{record.property_title}</span><br />
                    <span>{`${record.host_firstname} ${record.host_lastname}`}</span>
                </React.Fragment>);
            },

        },
        {
            title: <IntlMessages id="global.checkin" />,
            // dataIndex: "depart",
            key: "depart",
            render: (record) => {
                return moment(record.depart).format("DD/MM/YY");
            },
            sorter: true,
        },

        {
            title: <IntlMessages id="global.checkout" />,
            // dataIndex: "depart",
            key: "return_date",
            render: (record) => {
                return moment(record.return_date).format("DD/MM/YY");
            },
            sorter: true,
        },
        {
            title: <IntlMessages id="order.customer" />,
            key: "lastname",
            render: (text, record) => (
                <b>
                    <Link to={`/app/account/${record.cid}`} >
                        {record.firstname + " " + record.lastname}
                    </Link>
                </b>
            ),
        },


        {
            title: <IntlMessages id="order.total" />,
            render: (text, record) => {
                return (
                    <NumberFormat value={+record.total} thousandSeparator={true} displayType="text" suffix=" đ" />

                );
            },
            key: "total",
            sorter: true,
        },

        {
            title: <IntlMessages id="global.commission" />,
            dataIndex: "discount",
            key: "discount",
            render: (text, record) => {
                let discount = record.discount ? record.discount : 0;
                return (
                    <NumberFormat value={+ discount} thousandSeparator={true} displayType="text" suffix=" đ" />
                );
            },
        },
        {
            title: <IntlMessages id="global.status" />,
            key: "status",
            dataIndex: 'status',
            align: "center",
            render: (status, record) => (
                <React.Fragment>
                    <OrderStatus status={status}></OrderStatus>
                    {
                        status == 'ORDER_CANCELLED' ? (
                            <div>
                                {record.refund_status ? <small>{record.refund_status == 1 ? `Đã hoàn ${priceInVn(record.refund_amount)}` : `Hoàn tiền thất bại`}</small> : null}
                            </div>
                        ) : null
                    }
                    {status == "ORDER_COMPLETED" ? record.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment><br />Có sử dụng dịch vụ</React.Fragment> : record.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment><br />Không sử dụng dịch vụ</React.Fragment> : null : null}
                </React.Fragment>
            ),
        },
        {
            title: <IntlMessages id="global.created" />,
            dataIndex: "created_at",
            key: "created_at",
            className: "center-column",
            render: (text, record) => (
                <React.Fragment>
                    <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                    <div>{moment(record.created_at).format("HH:mm")}</div>
                </React.Fragment>
            ),
        },
        {
            title: <IntlMessages id="global.id" />,
            dataIndex: "id",
            key: "id",
            sorter: true,
        },
        {
            title: <IntlMessages id="global.action" />,
            // dataIndex: "id",
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
                        record.status == 'ORDER_CANCELLED' && record.pay_status == "PAYMENT_SUCCESS" && record.refund_status != 1 && record.subtotal > 0 ? (
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


    async componentDidMount() {
        try {
            await this.props.getListOrder(this.state.filter);
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
        getAllProperties(this.state.propertyFilter).then(res => this.setState({ ...this.state, listProperty: res.list }));
    }



    hideModal = () => {
        this.setState({
            modalVisible: false,
            cItem: {}
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


    onFilter(name, value) {
        if (name == "depart") {
            if (value) {
                value = value.toISOString().substr(0, 10);

                this.setState({
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                });
            } else {
                this.setState(
                    {
                        filter: {
                            ...this.state.filter,
                            [name]: {},
                        },
                    },
                    () => this.props.getListOrder(this.state.filter)
                );
            }
        } else {
            this.setState({
                filter: {
                    ...this.state.filter,
                    [name]: {
                        type: "=",
                        value: value,
                    },
                },
            });
        }
        setTimeout(() => {
            this.props.getListOrder(this.state.filter);
        }, 300);
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    onHandleCancel = () => {
        this.setState({ cancelBtnLoading: true })
        this.props.handleCancel(this.state.cItem.order_number).then(res => {
            this.setState({ cancelBtnLoading: false })
            this.hideModal();
        })
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
        extra = { currentDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
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
            () => {
                this.props.getListOrder(this.state.filter);
            }
        );
    };

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
                    await this.props.getListOrder(this.state.filter);
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
                    await this.props.getListOrder(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        }
    }

    filterDate = (value, name) => {
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
                        await this.props.getListOrder(this.state.filter);
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
                        await this.props.getListOrder(this.state.filter);
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

    filterProperty = debounce((v) => {
        getAllProperties({ ...this.state.propertyFilter, search: v }).then(res => this.setState({ ...this.state, listProperty: res.list }));
    }, 300)

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
                    await this.props.getListOrder(this.state.filter);
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
                await this.props.cancelStayOrder(order.id);
                await this.props.getListOrder(this.state.filter);
            }
        })
    }

    onCloseApproveProofModal() {
        this.setState({isShowProofModal: false, currentOrder: null});
    }

    async onConfirmProof(type) {
        var data = {
            is_confirmed: type,
            payment_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        await this.props.confirmProofOfPayment(this.state.currentOrder.id, data);
        this.onCloseApproveProofModal();
        await this.props.getListOrder(this.state.filter);
    }

    render() {
        const { loading, isShowPaymentModal, paymentInfo, currentOrder, isShowProofModal } = this.state;

        var { listOrderStay, paging, config } = this.props;
        listOrderStay = listOrderStay.map(item => {
            let i = item;
            delete i.children;
            return i;
        })


        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<React.Fragment><IntlMessages id="sidebar.orders" />{" "}<IntlMessages id="sidebar.stay_order" /></React.Fragment>}
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
                                <Col sm={{ span: 6 }} xs={{ span: 24 }} >
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="Chọn chỗ nghỉ"
                                        onChange={(v) => this.filter(v, "object_id")}
                                        allowClear
                                        showSearch
                                        onSearch={this.filterProperty}
                                        filterOption={false}
                                    >
                                        {this.state.listProperty && this.state.listProperty.length ?
                                            this.state.listProperty.map(item => (
                                                <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                                            ))
                                            : null
                                        }
                                    </Select>
                                </Col>
                            </FilterBar>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                                <span> Ngày đến:&nbsp;</span>
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
                                <SearchRoom
                                    supplier_id={this.state.filter.supplier_id.value}
                                    onChange={(v) => this.filter(v, 'object_id')}
                                    object_id={this.state.filter.object_id.value}
                                />
                            </div>
                            <Table
                                columns={this.columns}
                                dataSource={listOrderStay}
                                onChange={this.onChangTable}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    total: paging.count,
                                    defaultCurrent: +paging.page,
                                    pageSize: +paging.perpage,
                                }}
                                size="small"
                                loading={loading}
                                scroll={{
                                    x: true
                                }}
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>

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
                {
                    currentOrder ? (
                        <ApproveProofModal 
                            visible={isShowProofModal}
                            onCancel={() => this.onCloseApproveProofModal()}
                            onApprove={() => this.onConfirmProof(1)}
                            onReject={() => this.onConfirmProof(0)}
                            proof={currentOrder.proof_of_payment}
                            orderNumber={currentOrder.order_number}
                            showButtons={currentOrder.proof_approved_status != 1}
                        />
                    ) : null
                }
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        listOrderStay: state.orderTour.listOrderStay,
        tours: state.tour.listTour,
        paging: state.orderTour.paging,
        config: state.config,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getListOrder: (filter) => dispatch(getListOrder(filter)),
        getDetailOrderTour: (filter, id) => dispatch(getDetailOrderTour(filter, id)),
        handleCancel: (order_number, refund_amount) => dispatch(handleCancel(order_number, refund_amount)),
        cancelStayOrder: (orderId) => dispatch(cancelStayOrder(orderId)),
        getOrderPaymentInfo: (id) => dispatch(getOrderPaymentInfo(id)),
        confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
    };
};
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StayOrder)
);
