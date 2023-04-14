import React, { Component } from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Col, Row, Spin, Card, Timeline, message } from "antd";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { OrderStatus } from '../../../components/OrderStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VehicleTypeText } from '../../../components/VehicleType';
import { _getDetailOrder } from '../../../actions/TransportBookingAction';
import IntlMessages from "Util/IntlMessages";

class DetailOrder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            detail: null
        };
    }
    componentDidMount() {
        let { id } = this.props
        _getDetailOrder(id).then(res => {
            console.log(res)
            this.setState({
                loading: false,
                detail: res
            });
        }).catch(err => {
            message.error("Có lỗi xảy ra, vui lòng thử lại")
            this.setState({
                loading: false,
            });
        })

    }
    cssRow = () => {
        return {
            borderBottom: "1px solid #e8e8e8",
            padding: "0 !important",
            marginBottom: "1em ",

        };
    };

    render() {
        const { config } = this.props
        const { loading, detail } = this.state

        if (loading || !detail) return (
            <Spin>
            </Spin>
        )
        const { vehicle, airport, customer_info, passenger, route, city, place, price_info } = detail;
        var dropTime = null;
        if (route) {
            dropTime = moment(detail.depart).add(route.free_waiting_time, 'minute').format('DD/MM/YYYY HH:mm');
        }
        return (
            <div>
                <Card title={<IntlMessages id="global.order_info" />} style={{ marginBottom: "20px" }}>
                    <Row>
                        <Col xs={24} md={12}>
                            <p> <IntlMessages id="global.status" />:&nbsp;<OrderStatus status={detail.status} /></p>
                            <p><IntlMessages id="global.order_number" />:&nbsp;{detail.order_number}</p>
                            <p><IntlMessages id="global.total" />:&nbsp;{detail && detail.total ? <NumberFormat value={+detail.total} thousandSeparator={true} displayType="text" suffix=" đ" /> : null}</p>
                            <p>Chiết khấu:&nbsp;{detail && detail.commission ? <NumberFormat value={+detail.commission} thousandSeparator={true} displayType="text" suffix=" đ" /> : null}</p>
                            <p>Nhà cung cấp thu :&nbsp;{detail && detail.sup_earning ? <NumberFormat value={+detail.sup_earning} thousandSeparator={true} displayType="text" suffix=" đ" /> : null}</p>
                            {/* <p> <Button><IntlMessages id="global.update" /></Button></p> */}
                        </Col>
                        <Col xs={24} md={12}>
                            <p><IntlMessages id="global.created" />:&nbsp;{moment(detail.created_at).format("DD/MM/YYYY HH:mm")}</p>
                            <p><IntlMessages id="global.updated" />:&nbsp;{moment(detail.updated_at).format("DD/MM/YYYY HH:mm")}</p>
                            <p><IntlMessages id="global.payment_at" />:&nbsp;{moment(detail.updated_at).format("DD/MM/YYYY HH:mm")}</p>
                            <p style={{ fontStyle: "italic", fontWeight: "bold" }} >
                                {detail && detail.status == "ORDER_COMPLETED" ? detail.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment>Khách hàng có sử dụng dịch vụ</React.Fragment> : detail.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment>Khách hàng không sử dụng dịch vụ</React.Fragment> : null : null}
                            </p>
                            <p><span style={{ fontWeight: "bold" }}>  Ghi chú:&nbsp;</span>{detail && detail.total ? detail.notes : ""}</p>
                        </Col>
                    </Row>
                </Card>
                <Card title={'Chi tiết đơn hàng'} style={{ marginBottom: "20px" }}>
                    {vehicle ?
                        <div className="d-flex" >
                            {vehicle.image && vehicle.image.length ?
                                <div style={{ marginRight: "20px" }}>
                                    <img
                                        width={150}
                                        src={vehicle.image && vehicle.image.length ? config.url_asset_root + vehicle.image[0] : ""}
                                        alt="image"
                                    />
                                </div>
                                : null}
                            <div style={{ width: "100%" }}>
                                <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px" }}>{detail.route_type == 1 ? <IntlMessages id="global.route_onward" /> : <IntlMessages id="global.route_return" />}{" - "}{vehicle.title}  (<VehicleTypeText type={vehicle.type} />)</div>
                                {airport ?
                                    <div>
                                        {detail.route_type == 1 ?
                                            <Timeline>
                                                <Timeline.Item color="green">{airport.title}</Timeline.Item>
                                                <Timeline.Item>{detail.address}</Timeline.Item>
                                            </Timeline>
                                            :
                                            <Timeline>
                                                <Timeline.Item color="green">{detail.address}</Timeline.Item>
                                                <Timeline.Item>{airport.title}</Timeline.Item>
                                            </Timeline>
                                        }
                                    </div>
                                    : null}
                                <div style={{

                                }}>
                                    <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                                        <IntlMessages id="global.transfer_info" />
                                    </div>
                                    {detail.route_type == 1 ?
                                        <div style={{ alignItems: "center", marginBottom: "0px" }}>
                                            <Timeline>
                                                <Timeline.Item color="green">
                                                    <span style={{ color: "rgb(102,102,102)" }}>{moment(detail.depart).format("DD/MM/YYYY HH:mm")}</span>
                                                    &nbsp;
                                                            <IntlMessages id="global.pickup" />
                                                </Timeline.Item>
                                                <Timeline.Item dot={<FontAwesomeIcon color="rgb(146,155,171)" style={{ fontSize: "12px" }} icon={["fas", "clock"]} />}>
                                                    <IntlMessages id="global.transfer_time" />&nbsp;
                                                            {route ? route.free_waiting_time : "0"}&nbsp;
                                                            <IntlMessages id="global.min" />
                                                </Timeline.Item>
                                                <Timeline.Item>
                                                    <span style={{ color: "rgb(102,102,102)" }}>{dropTime}</span>
                                                    &nbsp;
                                                            <IntlMessages id="global.drop" />
                                                </Timeline.Item>
                                            </Timeline>
                                        </div>
                                        :
                                        <div style={{ alignItems: "center", marginBottom: "0px" }}>
                                            <Timeline>
                                                <Timeline.Item color="green">
                                                    <span style={{ color: "rgb(102,102,102)" }}>{moment(detail.depart).format("DD/MM/YYYY HH:mm")}</span>
                                                    &nbsp;
                                                            <IntlMessages id="global.pickup" />
                                                </Timeline.Item>
                                                <Timeline.Item dot={<FontAwesomeIcon color="rgb(146,155,171)" style={{ fontSize: "12px" }} icon={["fas", "clock"]} />}>
                                                    <IntlMessages id="global.transfer_time" />&nbsp;
                                                            {route ? route.free_waiting_time : "0"}&nbsp;
                                                            <IntlMessages id="global.min" />
                                                </Timeline.Item>
                                                <Timeline.Item>
                                                    <span style={{ color: "rgb(102,102,102)" }}>{dropTime}</span>
                                                    &nbsp;
                                                            <IntlMessages id="global.drop" />
                                                </Timeline.Item>
                                            </Timeline>
                                        </div>
                                    }
                                </div>
                                <div style={{

                                }}>
                                    <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                                        <IntlMessages id="global.route_info" />
                                    </div>
                                    <div style={{ alignItems: "center", marginBottom: "10px" }}>
                                        <span style={{ fontSize: "14px", marginRight: "10px" }}><FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "user-tie"]} /> {detail.qty}</span>
                                        <span style={{ fontSize: "14px" }}><FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "suitcase-rolling"]} /> <IntlMessages id="global.max" /> {vehicle.luggage} <IntlMessages id="global.luggage" /> </span>
                                    </div>
                                    {airport ?
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontSize: "14px" }}>
                                                <FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "plane"]} />&nbsp;{airport.title}
                                            </span>
                                        </div>
                                        : null}
                                    {city && place ?
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontSize: "14px" }}>
                                                <FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "map-marker-alt"]} />&nbsp;
                                                   {city.title} - {place.title}
                                            </span>

                                        </div>
                                        : null}
                                    {route ?
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontSize: "14px" }}>
                                                <FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "clock"]} />&nbsp;
                                                    <IntlMessages id="global.free" />&nbsp;{route.free_waiting_time}&nbsp;
                                                    <IntlMessages id="global.free_waiting_time" />
                                            </span>

                                        </div>
                                        : null}
                                    {route ?
                                        <div style={{ marginBottom: "10px" }}>
                                            <span style={{ fontSize: "14px" }}>
                                                <FontAwesomeIcon color="rgb(146,155,171)" icon={["fas", "times-circle"]} />&nbsp;
                                                    <IntlMessages id="global.free_cancel_hour_policy" />&nbsp;{route.cancel_hour_policy}&nbsp;
                                                    <IntlMessages id="global.cancel_hour_policy" />
                                            </span>
                                        </div>
                                        : null}
                                    {route && route.route_services && route.route_services.length ?
                                        route.route_services.map(item => (
                                            <div style={{ marginBottom: "10px" }}>
                                                <span style={{ fontSize: "14px" }}>
                                                    {item.title}
                                                </span>
                                            </div>
                                        ))
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                        : null}
                </Card>
                {price_info ?
                    <Card title={"Thông tin thanh toán"} style={{ width: '100%', marginBottom: "20px" }}>
                        <p> Giá gốc: <NumberFormat value={+price_info.base_price} thousandSeparator={true} displayType="text" suffix=" đ" /></p>
                        <p> Giảm giá host: <NumberFormat value={+price_info.host_promo || 0} thousandSeparator={true} displayType="text" suffix=" đ" /></p>
                        <p> Giảm giá 2stay: <NumberFormat value={+price_info.coupon_amount || 0} thousandSeparator={true} displayType="text" suffix=" đ" /></p>
                        <p> Thanh toán: <NumberFormat value={+price_info.payment} thousandSeparator={true} displayType="text" suffix=" đ" /></p>
                    </Card>
                    : null}
                {detail.status == "ORDER_CANCELLED" ?
                    <Card title={"Thông tin hoàn huỷ"} style={{ width: '100%', marginBottom: "20px" }}>
                        <p> Số tiền hoàn khi huỷ: <NumberFormat value={+detail.refund_amount} thousandSeparator={true} displayType="text" suffix=" đ" /></p>
                    </Card>
                    : null}
                {customer_info ?
                    <Card title={'Thông tin khách hàng'} style={{ width: '100%', marginBottom: "20px" }}>
                        <Row>
                            <Col xs={24} md={12}>
                                <p>Mã khách hàng: {detail.cid}</p>
                                <p><IntlMessages id="global.firstname" /> (<IntlMessages id="global.inpasport" />): {customer_info.passport_firstname}</p>
                                <p><IntlMessages id="global.lastname" /> (<IntlMessages id="global.inpasport" />): {customer_info.passport_lastname}</p>
                            </Col>
                            <Col xs={24} md={12}>
                                <p><IntlMessages id="global.phone" />:  <React.Fragment>({customer_info.phonecode}){customer_info.phone}</React.Fragment></p>
                                <p><IntlMessages id="global.email" />:   {customer_info.email}</p>
                            </Col>
                        </Row>
                    </Card>
                    : null}
                {passenger ?
                    <Card title={"Thông tin thêm"} style={{ width: '100%', marginBottom: "20px" }}>
                        <p>Yêu cầu đặc biệt: {passenger.note}</p>
                    </Card>
                    : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        config: state.config,
    };
};


export default withRouter(connect(mapStateToProps, null)(DetailOrder));