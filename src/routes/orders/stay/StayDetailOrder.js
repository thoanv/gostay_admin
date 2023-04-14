import React, { useState, useEffect } from 'react';
import { Card, Divider, Modal, Row, Col, Typography, Descriptions, Skeleton, Button } from 'antd';
import moment from 'moment';
// requests
import { LoadingOutlined, ExclamationCircleOutlined, EnvironmentOutlined, UsergroupAddOutlined, FilePdfOutlined } from '@ant-design/icons';
import axios from 'axios';
import { connect, useSelector } from 'react-redux';
import { OrderStatus } from '../../../components/OrderStatus';
import { priceInVn } from '../../../helpers/helpers';
import { detailBooking, exportReceipt, getPolicyCancel } from '../../../actions/OrderStay';
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { withRouter, Link } from "react-router-dom";
import { PayMethod } from '../../../components/PayMethod';
import { ApproveProofModal } from "../../../components/ApproveProofModal";
import { confirmProofOfPayment } from '../../../actions/OrderActions';

const { confirm } = Modal;
const { Title } = Typography;

class StayDetailOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            order: null,
            isShowProofModal: false
        }
    };


    componentDidMount() {
        detailBooking(this.props.match.params.id).then(order => {
            if (order) {
                console.log(order, 'order')
                this.setState({
                    loading: false,
                    order: order
                })
            }
        });

    }

    onNavigateDetail = (id) => {
        Router.push({
            pathname: `/stay/${id}`, query: {
                checkin: null,
                checkout: null,
                guest: 1,
                children: 0
            }
        }, undefined, { shallow: true });
    }

    async onConfirmProof(type) {
        var data = {
            is_confirmed: type,
            payment_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        try {
            await this.props.confirmProofOfPayment(this.state.order.id, data);
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
        
    }

    render() {
        const { loading, order, isShowProofModal } = this.state;

        console.log(order)

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<React.Fragment><IntlMessages id="sidebar.orders" />{" "}<IntlMessages id="sidebar.stay_order" /></React.Fragment>}
                        match={this.props.match}
                    />

                    <div className="container">
                        {
                            loading ? (
                                <Card className="mb-4">
                                    <Skeleton active paragraph={{ rows: 1 }} />
                                </Card>
                            ) : (
                                <React.Fragment>
                                    <Card className="mb-4">
                                        <Row align="middle" justify="space-between" type="flex">
                                            <div>
                                                <Title level={4}>{'Mã đơn hàng'}: #{order.order_number}</Title>
                                                <div>
                                                    <span className="mr-2">{<IntlMessages id="order_created_at" />}:</span><span>{moment(order.created_at).format('dd, lll')}</span>
                                                </div>
                                                <div className="d-flex justify-content-start">

                                                </div>
                                            </div>
                                            <div>
                                                <OrderStatus
                                                    status={order.status}
                                                    payStatus={order.pay_status}
                                                    createdAt={order.created_at}
                                                    orderNumber={order.order_number}
                                                    size="large"
                                                />

                                            </div>
                                        </Row>
                                    </Card>


                                    <Card>
                                        <Row align="top" justify="space-between" type="flex">
                                            <div>
                                                <Title level={5}>
                                                    <span className="mr-2 pointer" onClick={() => { onNavigateDetail(order.object_id) }} style={{ fontSize: '24px' }}>{order.room_title}</span>
                                                </Title>

                                                <div>
                                                    {/* <span style={{ display: "inline-flex" }}><EnvironmentOutlined style={{ fontSize: "14px" }} /></span> */}
                                                    <span className="flight-date mr-2 ml-2">{order.room_type}</span>
                                                    <span className="mr-2">|</span>
                                                    <span className="mr-2">{`${order.room_home_number}, ${order.room_street}, ${order.room_location}`}</span>

                                                </div>

                                                <div className="mt-1">
                                                    {/* <span style={{ display: "inline-flex" }}><UsergroupAddOutlined style={{ fontSize: "17px" }} /></span> */}
                                                    <span className="flight-date mr-2 ml-2 mb-2">{`${order.adults} ${"Người lớn"} ${order.children ? ` ${order.children} Trẻ em` : ''} `}</span>
                                                    {order.qty_room > 1 && <span>({order.qty_room + 'P'})</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="d-block checkin_info_booking mb-2">{`${'Ngày đến'}:  14:00 ${moment(order.depart).format('ddd, DD/MM/YYYY')}`}</span>
                                                <span className="d-block checkout_info_booking">{`${'Ngày đi'}:  12:00 ${moment(order.return_date).format('ddd, DD/MM/YYYY')}`}</span>
                                            </div>
                                        </Row>

                                        <Title level={4} className="mt-2 d-block">
                                            {`${'Chính sách huỷ phòng'}`}
                                        </Title>


                                        <div>
                                            {order.room_cancel_policy}
                                        </div>

                                        {
                                            order.notes && <React.Fragment>
                                                <Title level={5} className="mt-2 d-block">
                                                    {`${'Ghi chú'}`}
                                                </Title>
                                                <div>
                                                    {order.notes}
                                                </div>
                                            </React.Fragment>
                                        }


                                        <Row gutter={16} className="mt-4" type="flex">
                                            <Col md={16} sm={24}>
                                                <Title level={4}>{'Thông tin đặt phòng'}</Title>
                                                <Card className="mb-4">
                                                    {
                                                        loading ? (
                                                            <Skeleton active paragraph={{ rows: 2 }} />
                                                        ) : (
                                                            <Descriptions column={2}>
                                                                <Descriptions.Item label={'Họ tên'}>{order.customer_info.name_id}</Descriptions.Item>
                                                                <Descriptions.Item label={'Điện thoại'}>{order.customer_info.phone}</Descriptions.Item>
                                                                <Descriptions.Item label={'Email'}>{order.customer_info.email}</Descriptions.Item>
                                                            </Descriptions>
                                                        )
                                                    }
                                                </Card>
                                                {order.is_transfer_booking &&
                                                    <React.Fragment>
                                                        <Title level={4}>{'Thông tin người nhận phòng'}</Title>
                                                        <Card className="mb-4">
                                                            {
                                                                loading ? (
                                                                    <Skeleton active paragraph={{ rows: 2 }} />
                                                                ) : (
                                                                    <Descriptions column={2}>
                                                                        <Descriptions.Item label={'Họ tên'}>{order.passenger[0].name_id}</Descriptions.Item>
                                                                        <Descriptions.Item label={'Điện thoại'}>{order.passenger[0].mobile}</Descriptions.Item>
                                                                        <Descriptions.Item label={'Email'}>{order.passenger[0].email}</Descriptions.Item>
                                                                    </Descriptions>
                                                                )
                                                            }
                                                        </Card>
                                                    </React.Fragment>}
                                                <Title level={4}>{'Thông tin chủ nhà'}</Title>
                                                {
                                                    loading ? (
                                                        <div>
                                                            <Card className="mb-4">
                                                                <Skeleton active paragraph />
                                                            </Card>
                                                            <Card className="mb-4">
                                                                <Skeleton active paragraph />
                                                            </Card>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Card className="mb-4">
                                                                <Descriptions column={2}>
                                                                    <Descriptions.Item span={1} label={'Họ tên'}>{order.host_firstname} {order.host_lastname}</Descriptions.Item>
                                                                    <Descriptions.Item label={'Điện thoại'}>{order.host_mobile}</Descriptions.Item>
                                                                    <Descriptions.Item label={'Email'}>{order.host_email}</Descriptions.Item>
                                                                </Descriptions>
                                                            </Card>

                                                        </div>
                                                    )
                                                }
                                            </Col>
                                            <Col md={8} sm={24} xs={24}>
                                                <Title level={4}>{'Thông tin thanh toán'}</Title>
                                                <Card>
                                                    {
                                                        loading ? (
                                                            <Skeleton active />
                                                        ) : (
                                                            <div>
                                                                <Row align="middle" justify="space-between" type="flex">
                                                                    <div className="fl-order-payment-title">{`${'Phí thuê'}`}</div>
                                                                    <div className="fl-order-payment-value">{`${priceInVn(order.price_info.raw_price)} /${order.duration} ${'đêm'}`}</div>
                                                                </Row>
                                                                { order.price_info.cleaning_fee > 0 &&
                                                                    <Row align="middle" justify="space-between" type="flex">
                                                                        <div className="fl-order-payment-title">{'Phí dọn dẹp'}</div>
                                                                        <div className="fl-order-payment-value">{priceInVn(order.price_info.cleaning_fee)}</div>
                                                                    </Row>
                                                                }
                                                                {order.price_info.extra_fee > 0 &&
                                                                    <Row align="middle" justify="space-between" type="flex">
                                                                        <div className="fl-order-payment-title">{'Phí tính thêm (quá số người)'}</div>
                                                                        <div className="fl-order-payment-value">{priceInVn(order.price_info.extra_fee)}</div>
                                                                    </Row>
                                                                }
                                                                {
                                                                    order.price_info.promo > 0 &&
                                                                    <Row align="middle" justify="space-between" type="flex">
                                                                        <div className="fl-order-payment-title">{'Khuyến mại'}</div>
                                                                        <div className="fl-order-payment-value">{priceInVn(order.price_info.promo)}</div>
                                                                    </Row>
                                                                }
                                                                {
                                                                    order.coupon_code ? (
                                                                        <Row align="middle" justify="space-between" type="flex">
                                                                            <div className="fl-order-payment-title">{'Mã giảm giá'} ({order.coupon_code})</div>
                                                                            <div className="fl-order-payment-value">- {priceInVn(order.coupon_amount)}</div>
                                                                        </Row>
                                                                    ) : null
                                                                }
                                                                <Divider className="mt-2 mb-2" />
                                                                <Row align="bottom" justify="space-between" type="flex">
                                                                    <div className="fl-order-payment-title">{'Tổng tiền'}</div>
                                                                    <Title level={4} className="mb-0 fl-order-payment-value">{priceInVn(order.price_info.payment)}</Title>
                                                                </Row>

                                                            </div>
                                                        )
                                                    }
                                                </Card>
                                                {
                                                    order ? (
                                                        <Card>
                                                            <Row type="flex" align="middle" justify="space-between">
                                                                <div className="fl-order-payment-title">Phương thức thanh toán</div>
                                                                <div>
                                                                    <PayMethod
                                                                        methodCode={order.pay_method}
                                                                        paymentProofApproved={order.proof_approved_status}
                                                                        hasPaymentProof={order.proof_of_payment}
                                                                        onClickProofStatus={() => this.setState({ isShowProofModal: true })}
                                                                    />
                                                                </div>
                                                            </Row>
                                                            <ApproveProofModal
                                                                visible={isShowProofModal}
                                                                onCancel={() => this.setState({ isShowProofModal: false })}
                                                                onApprove={() => this.onConfirmProof(1)}
                                                                onReject={() => this.onConfirmProof(0)}
                                                                proof={order.proof_of_payment}
                                                                orderNumber={order.order_number}
                                                                showButtons={order.proof_approved_status != 1}
                                                            />
                                                        </Card>
                                                    ) : null
                                                }
                                            </Col>


                                        </Row>
                                    </Card>
                                </React.Fragment>
                            )}
                    </div>
                </div>

            </React.Fragment>
        )
    }

}

function mapDispatchToProps(dispatch) {
    return {
        confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
    }
}

export default withRouter(connect(null, mapDispatchToProps)(StayDetailOrder));


