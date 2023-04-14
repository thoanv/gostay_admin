import React from 'react';
import IntlMessages from "Util/IntlMessages";
import { Tag } from 'antd';


export const OrderStatus = (props) => {
    const { status } = props;
    switch (status) {
        case 'ORDER_PENDING': {
            return <Tag color='orange'><IntlMessages id='global.order_pending_confirm' /></Tag>
        }
        case 'ORDER_CONFIRMED': {
            return <Tag color='green'><IntlMessages id='global.order_confirm' /></Tag>
        }
        case 'ORDER_CANCELLATION_PENDING': {
            return <Tag color='#2db7f5'><IntlMessages id='global.order_cancel_pending' /></Tag>
        }
        case 'ORDER_REJECTED': {
            return <Tag color='#2db7f5'><IntlMessages id='global.order_cancel_pending' /></Tag>
        }
        case 'ORDER_CANCELLED': {
            return <Tag color='magenta'><IntlMessages id='global.order_cancel' /></Tag>
        }
        case 'ORDER_COMPLETED': {
            return <Tag color='#096dd9'><IntlMessages id='global.order_complete' /></Tag>
        }
        default: return <Tag color='red'><IntlMessages id='global.order_expire' /></Tag>;
    }

}