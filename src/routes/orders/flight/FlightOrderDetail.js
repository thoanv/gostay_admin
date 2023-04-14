import React, { Component } from 'react';
import { Card, Row, Col, Divider, Icon, Typography, Tag, Descriptions, Button, Popconfirm, Modal } from "antd";
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
import { generateAirline, convertClassOfFlightBooking, convertTime } from "../../../helpers/helpers";
import { StatusOrderFilter } from "../../../components/StatusOrderFilter";
import FilterBar from "../../../components/FilterBar";
import { priceInVn, processPayType, processBank, processPayStatus } from '../../../helpers/helpers';
// actions
import { getAllOrder, updateOrder, _exportOrder, issueTicketFlightOrder, handleCancel, _getDetailOrder } from "../../../actions/FlightBookingAction";
import { getOrderPaymentInfo, cancelFlightOrder, confirmProofOfPayment } from '../../../actions/OrderActions';
import { PayMethod } from '../../../components/PayMethod';
import { ApproveProofModal } from "../../../components/ApproveProofModal";

const { Title } = Typography;

class FlightOrderDetail extends Component {
    state = {
        flights: [],
        customer: {},
        passengers: [],
        paymentInfo: null,
        isShowPaymentModal: false,
        departurePnr: null,
        returnPnr: null,
        isShowProofModal: false
    }

    async componentDidMount() {
        let order = await this.props._getDetailOrder(this.props.match.params.id);
        let flightInfo = JSON.parse(order.flight_info);

        let flights = [flightInfo.departure];
        if (flightInfo.return) flights.push(flightInfo.return);
        let customer = JSON.parse(order.customer_info);
        let passengers = order.passengers;
        this.setState({ flights: flights, customer: customer, passengers: passengers });
        // pnr
        if (flightInfo.departurePnrCode) this.setState({ departurePnr: flightInfo.departurePnrCode });
        if (flightInfo.returnPnrCode) this.setState({ returnPnr: flightInfo.returnPnrCode });
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
                    window.location.reload();
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
                window.location.reload();
            }
        })
    }

    async onConfirmProof(type) {
        var data = {
            is_confirmed: type,
            payment_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        await this.props.confirmProofOfPayment(this.props.order.id, data);
        window.location.reload();
    }

    render() {
        var { order } = this.props;
        var { flights, customer, passengers, paymentInfo, isShowPaymentModal, departurePnr, returnPnr, isShowProofModal } = this.state;

        return (
            <div>
                <PageTitleBar
                    title="Chi tiết đơn hàng"
                    match={this.props.match}
                />
                <Card>
                    <Row type="flex" align="top" justify="space-between">
                        <div>
                            <Title level={4}>Mã đơn hàng: #{order.order_number}</Title>
                            <div>
                                <span className="mr-2">Được tạo lúc:</span><span>{moment(order.created_at).format('dd, lll')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <OrderStatus status={order.status} />
                            {
                                order.status == 'ORDER_CANCELLED' ? (
                                    <div>
                                        {order.refund_status ? <small>{order.refund_status == 1 ? `Đã hoàn ${priceInVn(order.refund_amount)}` : `Hoàn tiền thất bại`}</small> : null}
                                    </div>
                                ) : null
                            }
                            {
                                order.status == 'ORDER_CONFIRMED' || order.status == 'ORDER_COMPLETED' ? (
                                    <div>
                                        {
                                            order.flight_issue_ticket_status ? (
                                                <React.Fragment>
                                                    {
                                                        parseInt(order.flight_issue_ticket_status) == 1 ? (
                                                            <Tag color="green">Đã xuất vé</Tag>
                                                        ) : (
                                                            <Tag color="red">Xuất vé thất bại</Tag>
                                                        )
                                                    }
                                                </React.Fragment>
                                            ) : (
                                                <Tag color="orange">Chờ xuất vé</Tag>
                                            )
                                        }
                                    </div>
                                ) : null
                            }
                        </div>

                    </Row>
                </Card>
                <div className="mb-2 mt-2">
                    <React.Fragment>
                        {
                            parseInt(order.flight_issue_ticket_status) !== 1 && (order.status == 'ORDER_CONFIRMED' || order.status == 'ORDER_COMPLETED') ? (
                                <React.Fragment>
                                    {
                                        flights.length == 2 ? (
                                            <Popconfirm
                                                title="Chọn chiều xuất vé"
                                                cancelText="Chiều đi"
                                                okText="Chiều về"
                                                onConfirm={() => this.onIssueTicket(order.id, 'departure')}
                                                onCancel={() => this.onIssueTicket(order.id, 'return')}
                                            >
                                                <Button type="primary" size="small">Xuất vé</Button>
                                            </Popconfirm>
                                        ) : (
                                            <Button type="primary" size="small" onClick={() => this.onIssueTicket(order.id, 'departure')}>Xuất vé</Button>
                                        )
                                    }
                                    <Divider type="vertical" />
                                </React.Fragment>
                            ) : null
                        }
                    </React.Fragment>
                    <BtnResendMail order_id={order.id} />
                    {
                        (!order.status || order.status != 'ORDER_PENDING') && order.payment_info ? (
                            <React.Fragment>
                                <Divider type="vertical" />
                                <Button type="primary" size="small" onClick={() => this.getOrderPayment(order.id)}>Xem thanh toán</Button>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        order.status == 'ORDER_CANCELLED' && order.pay_status == "PAYMENT_SUCCESS" && order.refund_status != 1 && order.total > 0 ? (
                            <React.Fragment>
                                <Divider type="vertical" />
                                <Button type="danger" ghost size="small" onClick={() => this.onRefundOrder(order)}>Hoàn tiền</Button>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        order.status != 'ORDER_CANCELLED' && order.status != 'ORDER_CANCELLATION_PENDING' ? (
                            <React.Fragment>
                                <Divider type="vertical" />
                                <Button type="danger" size="small" onClick={() => this.onCancelOrder(order)}>Huỷ đơn hàng</Button>
                            </React.Fragment>
                        ) : null
                    }
                </div>
                <Card>
                    {
                        flights.map((flight, index) => {
                            let airline = generateAirline(flight.AirlineCode);
                            let flightClass = convertClassOfFlightBooking(flight.Class);
                            let pnrCode = index == 0 ? departurePnr : returnPnr;

                            return (
                                <div key={index}>
                                    <Row gutter={16} key={index} align="middle">
                                        <Col md={6} sm={24} xs={24}>
                                            <h4>{index == 0 ? 'Chiều đi' : 'Chiều về'}</h4>
                                            <div className="flight-date">{moment(flight.StartDate).format('dddd, ll')}</div>
                                        </Col>
                                        <Col md={8} sm={24} xs={24}>
                                            <Row align="middle">
                                                <img className="airline-logo mr-3" src={airline.logo} />
                                                <div>
                                                    <h4>{airline.name}</h4>
                                                    <div>{flightClass}</div>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col md={6} sm={16} xs={16}>
                                            <Row align="middle" justify="space-between">
                                                <div className="text-center">
                                                    <div>{moment(flight.StartDate).format('HH:mm')}</div>
                                                    <h4>{flight.StartPoint}</h4>
                                                </div>
                                                <div className="selected-flight-icon-divider">
                                                    <Divider>
                                                        <Icon type="arrow-right" />
                                                    </Divider>
                                                </div>
                                                <div className="text-center">
                                                    <div>{moment(flight.EndDate).format('HH:mm')}</div>
                                                    <h4>{flight.EndPoint}</h4>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col md={4} sm={8} xs={8}>
                                            <div className="text-right">
                                                <div>{convertTime(flight.Duration)}</div>
                                                <div>{flight.ListSegment.length == 1 ? 'Bay thẳng' : `${flight.ListSegment.length} điểm dừng`}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                    {
                                        pnrCode && parseInt(order.flight_issue_ticket_status) == 1 && ['ORDER_PENDING_PAYMENT', 'ORDER_PENDING', 'ORDER_EXPIRED'].indexOf(order.status) < 0 ? (
                                            <div>
                                                <span className="mr-1"><b>PNR Code:</b></span><span><Tag color="orange">{pnrCode}</Tag></span>
                                            </div>
                                        ) : null
                                    }
                                    <Divider />
                                </div>
                            )
                        })
                    }
                    <Row gutter={16} className="mt-4">
                        <Col lg={16} md={24} sm={24} xs={24} >
                            <Title level={4}>Thông tin liên hệ</Title>
                            <Card className="mb-4">
                                <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                                    <Descriptions.Item span={2} label={'Tên'}>{customer.firstName} {customer.lastName}</Descriptions.Item>
                                    <Descriptions.Item label={'Số điện thoại'}>{customer.phone}</Descriptions.Item>
                                    <Descriptions.Item label={'Email'}>{customer.email}</Descriptions.Item>
                                    <Descriptions.Item span={2} label={'Ghi chú từ khách hàng'}>{order.notes}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                            <Title level={4}>Thông tin hành khách</Title>
                            <div>
                                {
                                    passengers.map((passenger, index) => {
                                        let passengerType = 'Người lớn';
                                        if (passenger.passenger_type == 'PASSENGER_CHILDREN') passengerType = 'Trẻ em';
                                        else if (passenger.passenger_type == 'PASSENGER_INFANT') passengerType = 'Trẻ sơ sinh';

                                        return (
                                            <Card className="mb-4" key={index}>
                                                <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                                                    <Descriptions.Item span={2} label="Họ tên">{passenger.firstname} {passenger.lastname}</Descriptions.Item>
                                                    <Descriptions.Item label="Số điện thoại">{passenger.mobile}</Descriptions.Item>
                                                    <Descriptions.Item label="Giới tính">{passenger.gender == '1' ? 'Nam' : 'Nữ'}</Descriptions.Item>
                                                    <Descriptions.Item label="Ngày sinh">{moment(passenger.birthday).format('DD/MM/YYYY')}</Descriptions.Item>
                                                    <Descriptions.Item label="Kiểu hành khách">{passengerType}</Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                        <Col lg={8} md={24} sm={24} xs={24}>
                            <Title level={4}>Thông tin thanh toán</Title>
                            <Card>
                                <div>
                                    <Row type="flex" justify="space-between">
                                        <div className="fl-order-payment-title">Giá vé</div>
                                        <div className="fl-order-payment-value">{priceInVn(order.subtotal)}</div>
                                    </Row>
                                    <Row type="flex" justify="space-between" className="mt-1">
                                        <div className="fl-order-payment-title">Thuế và phí</div>
                                        <div className="fl-order-payment-value">Đã bao gồm</div>
                                    </Row>
                                    {
                                        order.coupon_code ? (
                                            <Row type="flex" justify="space-between" className="mt-1">
                                                <div className="fl-order-payment-title">Mã giảm giá ({order.coupon_code})</div>
                                                <div className="fl-order-payment-value">- {priceInVn(order.coupon_amount)}</div>
                                            </Row>
                                        ) : null
                                    }
                                    <Divider className="mt-2 mb-2" />
                                    <Row type="flex" align="bottom" justify="space-between">
                                        <div className="fl-order-payment-title">Tổng cộng</div>
                                        <Title level={4} className="mb-0 fl-order-payment-value">{priceInVn(order.total)}</Title>
                                    </Row>
                                </div>
                            </Card>
                            <Card>
                                <Row type="flex" align="middle" justify="space-between">
                                    <div className="fl-order-payment-title">Phương thức thanh toán</div>
                                    <div>
                                        <PayMethod
                                            methodCode={order.pay_method}
                                            paymentProofApproved={order.proof_approved_status}
                                            hasPaymentProof={order.proof_of_payment}
                                            onClickProofStatus={() => this.setState({isShowProofModal: true})}
                                        />
                                    </div>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
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
                <ApproveProofModal
                    visible={isShowProofModal}
                    onCancel={() => this.setState({isShowProofModal: false})}
                    onApprove={() => this.onConfirmProof(1)}
                    onReject={() => this.onConfirmProof(0)}
                    proof={order.proof_of_payment}
                    orderNumber={order.order_number}
                    showButtons={order.proof_approved_status != 1}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        order: state.flightOrder.detail
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
        _getDetailOrder: (id) => dispatch(_getDetailOrder(id)),
        confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlightOrderDetail));
