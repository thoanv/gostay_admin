import IntlMessages from "Util/IntlMessages";
import React from 'react';

export const StatusOrderFilter = [
    {
        id: 'ORDER_PENDING_CONFIRMATION',
        title: <IntlMessages id="global.order_pending_confirm" />
    },
    {
        id: 'ORDER_CONFIRMED',
        title: <IntlMessages id='global.order_confirm' />
    },
    {
        id: 'ORDER_COMPLETED',
        title: <IntlMessages id='global.order_complete' />
    },
    {
        id: 'ORDER_CANCELLED',
        title: <IntlMessages id='global.order_cancel' />
    },
    {
        id: 'ORDER_EXPIRED',
        title: <IntlMessages id="global.order_expired" />
    },
]

export const formatStatusOrder = (status) => {
    switch (status) {
        case 'ORDER_PENDING_CONFIRMATION': {
            return "Chờ xác nhận"
        }
        case 'ORDER_CONFIRMED': {
            return "Đã xác nhận"
        }
        case 'ORDER_COMPLETED': {
            return "Đã hoàn thành"
        }
        case 'ORDER_CANCELLED': {
            return "Đã huỷ"
        }
        default: return "Đã hết hạn"
    }
}
