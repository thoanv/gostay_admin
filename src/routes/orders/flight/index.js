import { Table, Row, Divider, Button, List, Icon, Popover, DatePicker, Col, message, Modal, Popconfirm, Descriptions, InputNumber } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import NumberFormat from "react-number-format";
import moment from "moment";
import { OrderStatus } from "../../../components/OrderStatus";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnResendMail from "../../../components/BtnResendMail";
import { generateAirline } from "../../../helpers/helpers";
import { StatusOrderFilter } from "../../../components/StatusOrderFilter";
import FilterBar from "../../../components/FilterBar";
import { priceInVn, processPayType, processBank, processPayStatus } from '../../../helpers/helpers';
// actions
import { getAllOrder, updateOrder, _exportOrder, issueTicketFlightOrder, handleCancel } from "../../../actions/FlightBookingAction";
import { getOrderPaymentInfo, cancelFlightOrder, confirmProofOfPayment } from '../../../actions/OrderActions';
import { PayMethod } from "../../../components/PayMethod";
import { ApproveProofModal } from "../../../components/ApproveProofModal";

const { RangePicker } = DatePicker;

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
            },
            loading: true,
            open: false,
            item: null,
            listAirport: [],
            paymentInfo: {},
            isShowPaymentModal: false,
            refundAmount: 0,
            isShowProofModal: false,
            currentOrder: null
        }

        this.columns = [
            {
                title: <IntlMessages id="global.order_number" />,
                key: "order_number",
                sorter: true,
                dataIndex: "order_number",
                fixed: true,
                render: (text, record) => {
                    return (
                        <Link to={`/app/orders/flight/${record.id}`}>
                            {record.order_number}
                        </Link>
                    );
                },
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                align: 'center',
                key: 'status',
                render: (text, record) => (
                    <div>
                        <OrderStatus status={text} />
                        {
                            text == 'ORDER_CANCELLED' ? (
                                <div>
                                    {record.refund_status ? <small>{record.refund_status == 1 ? `Đã hoàn ${priceInVn(record.refund_amount)}` : `Hoàn tiền thất bại`}</small> : null}
                                </div>
                            ) : null
                        }
                    </div>
                )
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
                title: <IntlMessages id="global.total" />,
                key: "total",
                dataIndex: "total",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.total} thousandSeparator={true} displayType="text" suffix="đ" />

                    );
                },
            },
            {
                title: <IntlMessages id="global.commission" />,
                key: "discount",
                dataIndex: "discount",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.discount} thousandSeparator={true} displayType="text" suffix="đ" />

                    );
                },
            },
            {
                title: <IntlMessages id="flight.contact_info" />,
                dataIndex: "customer_info",
                render: (text, record) => {
                    let customerInfo = JSON.parse(text);

                    return (
                        <div>
                            <div className="font-weight-bold">{customerInfo.firstName} {customerInfo.lastName}</div>
                            <div><small className="flight-customer-info-item"><Icon type="phone" /> {customerInfo.phone}</small></div>
                            <div><small className="flight-customer-info-item"><Icon type="mail" /> {customerInfo.email}</small></div>
                        </div>
                    )
                }
            },
            {
                title: <IntlMessages id="flight.schedule" />,
                dataIndex: "flight_info",
                key: "flight_info",
                align: 'center',
                width: '20%',
                render: (text, record) => {
                    let flightInfo = JSON.parse(record.flight_info);
                    let departureAirline = null;
                    if (flightInfo.departure) departureAirline = generateAirline(flightInfo.departure.AirlineCode);

                    let returnAirline = null;
                    if (flightInfo.return) returnAirline = generateAirline(flightInfo.return.AirlineCode);
                    // var 
                    return (
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="text-center">
                                    <div className="font-weight-bold">{flightInfo.departure.StartPoint}</div>
                                    <div><small>{moment(flightInfo.departure.StartDate).format('HH:mm DD/MM')}</small></div>
                                </div>
                                <div>
                                    <img src={require('../../../assets/img/right-arrow.png')} height={16} />
                                    <div className="d-flex align-items-center">
                                        <img src={departureAirline.logo} height={16} />
                                        <small className="ml-1">{departureAirline.name} ({flightInfo.departure.FlightNumber})</small>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-weight-bold">{flightInfo.departure.EndPoint}</div>
                                    <div><small>{moment(flightInfo.departure.EndDate).format('HH:mm DD/MM')}</small></div>
                                </div>
                            </div>
                            {
                                flightInfo.return ? (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div className="text-center">
                                            <div className="font-weight-bold">{flightInfo.return.StartPoint}</div>
                                            <div><small>{moment(flightInfo.return.StartDate).format('HH:mm DD/MM')}</small></div>
                                        </div>
                                        <div>
                                            <img src={require('../../../assets/img/right-arrow.png')} height={16} />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <img src={returnAirline.logo} height={16} />
                                                <small className="ml-2">{returnAirline.name} ({flightInfo.return.FlightNumber})</small>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-weight-bold">{flightInfo.return.EndPoint}</div>
                                            <div><small>{moment(flightInfo.return.EndDate).format('HH:mm DD/MM')}</small></div>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    )
                }
            },
            {
                title: <IntlMessages id="flight.passenger" />,
                dataIndex: "passengers",
                key: "passengers",
                // sorter: true,
                align: 'center',
                render: (text, record) => (
                    <Popover
                        title={<IntlMessages id="flight.passenger" />}
                        trigger="click"
                        arrowPointAtCenter
                        content={
                            <List
                                itemLayout="horizontal"
                                dataSource={record.passengers}
                                renderItem={item => {
                                    let iconName = 'user';
                                    if (item.passenger_type == 'PASSENGER_CHILDREN') iconName = 'child';
                                    if (item.passenger_type == 'PASSENGER_INFANT') iconName = 'baby';

                                    return (
                                        <List.Item >
                                            <List.Item.Meta
                                                title={<b><FontAwesomeIcon icon={iconName} /> {item.firstname} {item.lastname}</b>}
                                                description={<div><FontAwesomeIcon icon={["far", "calendar"]} /> {moment(item.birthday).format('DD/MM/YYYY')} | <FontAwesomeIcon icon="venus-mars" /> {item.gender == 1 ? 'Nam' : 'Nữ'}</div>}
                                            />
                                        </List.Item>
                                    )
                                }}
                            />
                        }
                    >
                        <Link to='#'>{record.passengers.length} <IntlMessages id="flight.passenger" /></Link>
                    </Popover>
                )
            },
            {
                title: <IntlMessages id="global.order_created" />,
                dataIndex: "created_at",
                key: "created_at",
                align: 'center',
                render: (text, record) => (
                    <div>
                        <div>{moment(record.created_at).format("HH:mm")}</div>
                        <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                    </div>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
            },
            {
                title: <IntlMessages id="global.action" />,
                // dataIndex: "created_at",
                render: (text, record) => {
                    let flightInfo = JSON.parse(record.flight_info);
                    return (
                        <div>
                            {
                                parseInt(record.flight_issue_ticket_status) !== 1 && (record.status == 'ORDER_CONFIRMED' || record.status == 'ORDER_COMPLETED') ? (
                                    <React.Fragment>
                                        {
                                            flightInfo.return ? (
                                                <Popconfirm
                                                    title="Chọn chiều xuất vé"
                                                    cancelText="Chiều đi"
                                                    okText="Chiều về"
                                                    onConfirm={() => this.onIssueTicket(record.id, 'departure')}
                                                    onCancel={() => this.onIssueTicket(record.id, 'return')}
                                                >
                                                    <Button type="primary" size="small" className="mb-1">Xuất vé</Button>
                                                </Popconfirm>
                                            ) : (
                                                <Button type="primary" size="small" className="mb-1" onClick={() => this.onIssueTicket(record.id, 'departure')}>Xuất vé</Button>
                                            )
                                        }
                                        <br />
                                    </React.Fragment>
                                ) : null
                            }
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

                    )
                }
            },
        ];
    }

    async componentDidMount() {
        try {
            await this.props._getAll(this.state.filter);
            this.setState({ loading: false })
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

    onIssueTicket = (id, type) => {
        Modal.confirm({
            title: 'Bạn chắc chắn muốn xuất vé của đơn hàng này chứ?',
            onOk: async () => {
                await this.props.issueTicketFlightOrder({
                    id: id,
                    type: type
                });
            }
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
                await this.props.cancelFlightOrder(order.id);
                await this.props._getAll(this.state.filter);
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
        await this.props._getAll(this.state.filter);
    }

    render() {
        const { loading, isShowPaymentModal, paymentInfo, isShowProofModal, currentOrder } = this.state;
        const { list, paging } = this.props;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<React.Fragment><IntlMessages id="sidebar.orders" /> {" "}<IntlMessages id="sidebar.flight" /></React.Fragment>}
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
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                                        <span> Ngày đi:&nbsp;</span>
                                        <RangePicker
                                            allowEmpty={[true, true]}
                                            format="YYYY-MM-DD"
                                            onChange={(date, dateStr) => this.filterDate(dateStr, "depart")}
                                            placeholder={['Từ ngày', 'Đến ngày']}
                                        />
                                    </div>
                                </Col>
                                <Col sm={{ span: 6 }} xs={{ span: 24 }} >
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                                        <span>Ngày đặt:&nbsp; </span>
                                        <RangePicker
                                            allowEmpty={[true, true]}
                                            format="YYYY-MM-DD"
                                            onChange={(date, dateStr) => this.filterDate(dateStr, "created")}
                                            placeholder={['Từ ngày', 'Đến ngày']}
                                        />
                                    </div>
                                </Col>
                            </FilterBar>

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
        list: state.flightOrder.list,
        config: state.config,
        paging: state.flightOrder.paging,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAll: (filter) => dispatch(getAllOrder(filter)),
        updateOrder: (id) => dispatch(updateOrder(id)),
        issueTicketFlightOrder: (data) => dispatch(issueTicketFlightOrder(data)),
        handleCancel: (order_number, refund_amount) => dispatch(handleCancel(order_number, refund_amount)),
        cancelFlightOrder: (orderId) => dispatch(cancelFlightOrder(orderId)),
        getOrderPaymentInfo: (id) => dispatch(getOrderPaymentInfo(id)),
        confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reservation));