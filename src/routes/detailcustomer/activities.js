import { Form, Table, Tabs, Tag } from "antd";
import moment from "moment";
import React, { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import DetailReview from '../../components/detailreview';
import { OrderStatus } from "../../components/OrderStatus";
const columncoupon = [
    {
        title: <IntlMessages id="coupon.code" />,
        dataIndex: "code",
        key: "code",
        width: 100
    },
    {
        title: <IntlMessages id="coupon.title" />,
        key: "title",
        render: record => {
            return (
                <span >
                    {record.title}
                </span>
            );
        },
        width: 200
    },


    {
        title: <IntlMessages id="coupon.expired" />,
        key: "expired",
        render: record => {
            return (
                <React.Fragment>
                    {moment(record.expired).format("23:59:59") <
                        moment().format("23:59:59") ? (
                            <Tag color="red">
                                {moment(record.expired).format("DD-MM-YYYY")}
                            </Tag>
                        ) : (
                            <Tag color="green">
                                {moment(record.expired).format("DD-MM-YYYY")}
                            </Tag>
                        )}
                </React.Fragment>
            );
        },
        width: 100
    },
    {
        title: <IntlMessages id="coupon.min_order" />,
        key: "min_order",
        render: record => {
            return +record.min_order === 0 || record.min_order === null
                ? 0
                : +record.min_order;
        },
        width: 100,
        className: "center-column",
    },

    {
        title: <IntlMessages id="coupon.amount" />,
        dataIndex: "amount",
        key: "amount",
        width: 100,
        className: "center-column",
    },
    {
        title: <IntlMessages id="coupon.created" />,
        key: "created_at",
        render: record => {
            return moment(record.created_at).format("DD/MM/YYYY");
        },
        width: 100
    },

];

class Activities extends Component {

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        const formDesc = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };

        const columnorder = [
            {
                title: <IntlMessages id="order.number" />,
                key: "order_number",
                render: (record) => (
                    <React.Fragment>
                        <div>

                            {record.order_number}

                        </div>

                    </React.Fragment>
                ),
                width: 100,
            },

            {
                title: <IntlMessages id="global.type" />,
                key: "type",
                width: 100,
                dataIndex: "type"
            },
            {
                title: <IntlMessages id="order.depart" />,
                className: "center-column",
                key: "depart",
                render: (record) => {
                    return moment(record.depart).format("DD/MM/YYYY");
                },
                width: 100,
            },

            {
                title: <IntlMessages id="order.total" />,
                key: "total",
                className: "center-column",
                width: 100,
                dataIndex: "total"
            },
            {
                title: <IntlMessages id="global.status" />,
                key: "order_status",
                width: 100,
                render: (status, record) => (
                    <React.Fragment>
                        <OrderStatus status={record.status}></OrderStatus>
                        {status == 'ORDER_CANCELLED' ? record.cancelled_completed ?
                            <p style={{ fontSize: "10px" }}>{`Đã chuyển `}
                                <strong>
                                    <NumberFormat value={+record.refund_amount} thousandSeparator={true} displayType="text" suffix=" đ" />
                                </strong>
                            </p> :
                            <div>
                                <p
                                    style={{ color: "blue", cursor: "pointer", margin: 0 }}

                                >
                                    Chưa xử lý
                </p>
                            </div>
                            :
                            null}
                        {status == "ORDER_COMPLETED" ? record.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment><br />Có sử dụng dịch vụ</React.Fragment> : record.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment><br />Không sử dụng dịch vụ</React.Fragment> : null : null}
                    </React.Fragment>
                ),
            },

            {
                title: <IntlMessages id="global.created" />,
                className: "center-column",
                key: "created_at",
                render: (record) => {
                    return moment(record.created_at).format("DD/MM/YYYY");
                },
                width: 100,
            },
        ];

        const { TabPane } = Tabs;
        const { countlistOrderTour, count_review, orders, count_listactivecoupon, listactivecoupon, allReview } = this.props


        return (
            <div>
                <Form {...formItemLayout} >
                    <Tabs defaultActiveKey="1">

                        <TabPane tab={countlistOrderTour ? `Booking ` + `(` + countlistOrderTour + `)` : <IntlMessages id="global.order" />} key="2">
                            <Table
                                rowSelection={null}
                                columns={columnorder}
                                dataSource={orders}
                                tableLayout="auto"
                                size="small"
                                rowKey="order_number"

                            />
                        </TabPane>
                        <TabPane tab={count_review ? `Review ` + `(` + count_review + `)` : <IntlMessages id="global.review" />} key="1">
                            <DetailReview review={allReview} />


                        </TabPane>

                        <TabPane tab={count_listactivecoupon ? `Active coupon ` + `(` + count_listactivecoupon + `)` : <IntlMessages id="global.active_coupon" />} key="3">
                            <Table
                                rowSelection={null}
                                columns={columncoupon}
                                dataSource={listactivecoupon}
                                tableLayout="auto"
                                size="small"
                                rowKey="id"
                                scroll={{ y: 350 }}
                                pagination={{
                                    total: count_listactivecoupon,
                                    showSizeChanger: false,
                                    defaultPageSize: 10
                                }}
                            />
                        </TabPane>

                    </Tabs>
                </Form>
            </div>
        );
    }
}

export default Activities;