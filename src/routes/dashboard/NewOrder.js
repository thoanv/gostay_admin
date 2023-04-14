import React, { useState, useEffect } from 'react';
import { List, Avatar, message, Row, Col, Tag } from 'antd';
import { getNewOrder } from '../../actions/CommonActions';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { priceInVn } from '../../helpers/helpers';
import IntlMessages from "Util/IntlMessages";

const orderStatus = (status) => {
    switch (status) {
        case 'ORDER_PENDING': {
            return <b style={{ color: 'orange', float: "right" }}><IntlMessages id='global.order_pending_confirm' /></b>
        }
        case 'ORDER_CONFIRMED': {
            return <b style={{ color: '#108ee9', float: "right" }} ><IntlMessages id='global.order_confirm' /></b>
        }
        case 'ORDER_CANCELLED': {
            return <b style={{ color: 'red', float: "right" }}><IntlMessages id='global.order_cancel' /></b>
        }
        case 'ORDER_COMPLETED': {
            return <b style={{ color: '#096dd9', float: "right" }}><IntlMessages id='global.order_complete' /></b>
        }
        default: return <b style={{ color: 'red', float: "right" }}><IntlMessages id='global.order_expire' /></b>;
    }

}

function NewOrder(props) {
    moment.locale('vi');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const config = useSelector(state => state.config);
    var url_asset_root = config ? config.url_asset_root : "";

    useEffect(() => {
        getNewOrder().then(res => {
            setData(res);
            setLoading(false)
        }).catch(err => {
            console.log(err.response)
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, []);

    const getIcon = (type) => {
        if (type == "STAY") return (<Tag color="#2db7f5" style={{ fontSize: "20px", width: "50px", height: "50px", textAlign: "center", margin: "0px" }} ><FontAwesomeIcon style={{ marginTop: "12px" }} icon={["fas", "home"]} /></Tag>);
        if (type == "CAR") return (<Tag color="#87d068" style={{ fontSize: "20px", width: "50px", height: "50px", textAlign: "center", margin: "0px" }} ><FontAwesomeIcon style={{ marginTop: "12px" }} icon={["fas", "car"]} /></Tag>);
        if (type == "FLIGHT") return (<Tag color="#108ee9" style={{ fontSize: "20px", width: "50px", height: "50px", textAlign: "center", margin: "0px" }}><FontAwesomeIcon style={{ marginTop: "12px" }} icon={["fas", "plane"]} /></Tag>);
    }

    const getCustomerInfo = (customer_info) => {
        if (typeof customer_info == "string") customer_info = JSON.parse(customer_info);

        return {
            firstname: customer_info.firstName || customer_info.passport_firstname || customer_info.name_id,
            lastname: customer_info.lastName || customer_info.passport_lastname || "",
            phone: customer_info.phone,
            email: customer_info.email
        };
    }

    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => {
                var customer_info = getCustomerInfo(item.customer_info);
                var m = moment(item.created_at);
                return (
                    <List.Item>
                        <Row type="flex" justify="center" align="middle" style={{ width: "100%" }}>
                            <Col span={4}>
                                {getIcon(item.type)}
                            </Col>
                            <Col span={12}>
                                <div>
                                    <div><b>{customer_info.firstname + " " + customer_info.lastname}</b></div>
                                    <div>{customer_info.phone}</div>
                                    <div style={{ color: "#999" }}> {m.fromNow()}  </div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <b style={{ float: "right" }}>{priceInVn(item.total)}</b><br />
                                {orderStatus(item.status)}
                            </Col>
                        </Row>
                    </List.Item>
                )
            }
            }
        />
    )

}

export default NewOrder;