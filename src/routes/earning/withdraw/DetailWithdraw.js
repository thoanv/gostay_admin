import React, { Component, useEffect, useState, useRef } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Radio, Tag, Table, Spin, Empty, message } from "antd";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import NumberFormat from 'react-number-format';
import moment from 'moment'
import { getWithdrawDetail, withdrawDecline, withdrawApprove } from '../../../actions/WithdrawAction';


function DetailWithdraw(props) {
    const { open, withdraw } = props;

    const columns = [
        {
            title: <IntlMessages id="global.order_number" />,
            key: "order_number",
            dataIndex: "order_number",
        },

        {
            title: <IntlMessages id="global.order_type" />,
            key: "type",
            dataIndex: "type",
            render: (text, record) => {
                if (text == "STAY") return "Stay";
                if (text == "CAR") return "Transport";
                return "Flight";
            },
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
            title: <IntlMessages id="supplier.earned" />,
            key: "sup_earning",
            dataIndex: "sup_earning",
            render: (text, record) => {
                return (
                    <NumberFormat value={+record.sup_earning} thousandSeparator={true} displayType="text" suffix=" đ" />

                );
            },
        },

        {
            title: <IntlMessages id="global.created_at" />,
            dataIndex: "created_at",
            key: "created_at",
            render: (text, record) => (
                <React.Fragment>
                    <div>{moment(record.created_at).format("DD/MM/YYYY HH:mm")}</div>
                </React.Fragment>
            ),
        },

    ];

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputEl = useRef(null);

    const onApprove = async () => {
        if (detail) {
            var note = inputEl.current.state.value;
            console.log(note);
            var data = {
                note: note
            }
            try {
                setLoading(true)
                await withdrawApprove(detail.id, data);
                setLoading(false);
                message.success("Xác nhận thành công");
                props.onReload();
                props.onClose();
            } catch (error) {
                setLoading(false);
                message.error("Có lỗi xảy ra, vui lòng thử lại")
            }
        }
    }

    const onDecline = async () => {
        if (detail) {
            var note = inputEl.current.state.value;
            console.log(note);
            var data = {
                note: note
            }
            try {
                setLoading(true)
                await withdrawDecline(detail.id, data);
                setLoading(false);
                message.success("Từ chối thành công");
                props.onReload();
                props.onClose();

            } catch (error) {
                setLoading(false);
                console.log(error)
                message.error("Có lỗi xảy ra, vui lòng thử lại")

            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                var res = await getWithdrawDetail(withdraw.id);
                setDetail(res);
                setLoading(false);

            } catch (error) {
                setDetail(null);
                setLoading(false);
            }
        }
        if (withdraw) {
            fetchData();
        }
    }, [withdraw])


    var orders = detail && detail.listOrder && detail.listOrder.length ? detail.listOrder : [];
    return (
        <Modal
            visible={open}
            footer={null}
            onCancel={() => props.onClose()}
            width='60%'
        >
            <Spin spinning={loading}>
                {loading || detail ?
                    <React.Fragment>
                        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                            <Col xs={24} md={24}>
                                <p>
                                    <span style={{ fontWeight: "bold" }}><IntlMessages id="global.status" />:</span>{' '}
                                    {detail && detail.status ?
                                        detail.status == 'PENDING' ?
                                            <Tag color='orange'><IntlMessages id='global.transaction_pending' /></Tag>
                                            :
                                            detail.status == 'APPROVED' ?
                                                <Tag color='green'><IntlMessages id='global.transaction_approved' /></Tag>
                                                :
                                                <Tag color='red'><IntlMessages id='global.transaction_declined' /></Tag>
                                        : null}</p>
                            </Col>
                            <Col xs={24} md={24}>
                                <p>
                                    <span style={{ fontWeight: "bold" }}> <IntlMessages id="transaction.amount" />:</span>{' '}
                                    {detail && detail.amount ?
                                        <NumberFormat value={+detail.amount} thousandSeparator={true} displayType="text" suffix=" đ" />
                                        : null}</p>
                            </Col>
                            <Col xs={24} md={24}>
                                <p>
                                    <span style={{ fontWeight: "bold" }}> <IntlMessages id="transaction.created_at" />:</span>{' '}
                                    {detail && detail.created_at ?
                                        moment(detail.created_at).format("HH:mm DD/MM/YYYY")
                                        : null}</p>
                            </Col>
                            {detail ?
                                <Col xs={24} md={24}>
                                    <p><span style={{ fontWeight: "bold" }}>Tài khoản thụ hưởng:</span>  {`${detail.bank_account_name}, STK: ${detail.bank_account_number}, ${detail.bank_name}, chi nhánh ${detail.bank_branch}, ${detail.bank_city}  `}</p>
                                </Col>
                                : null}
                            {detail ? detail.status == "PENDING" ?
                                <Col xs={24} md={24} style={{ marginBottom: "20px" }}>
                                    <p><span style={{ fontWeight: "bold" }}>Ghi chú: </span></p>
                                    <Input.TextArea rows="4" ref={inputEl} style={{ marginBottom: "10px" }}></Input.TextArea>
                                    <Button type="primary" style={{ marginRight: "20px" }} onClick={onApprove}>Xác nhận</Button>
                                    <Button type="danger" onClick={onDecline}>Từ chối</Button>
                                </Col>
                                :
                                <Col xs={24} md={24}>
                                    {detail.note ? <p><span style={{ fontWeight: "bold" }}>Ghi chú: </span>{detail.note}</p> : null}
                                </Col>
                                : null}
                        </Row>

                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>Danh sách đơn hàng</p>
                        <Table
                            tableLayout="auto"
                            columns={columns}
                            dataSource={orders}
                            rowKey="id"
                            size="small"
                            pagination={false}
                            scroll={{ y: '500px' }}
                        />
                    </React.Fragment>
                    : <Empty />
                }
            </Spin>
        </Modal>

    )
}


export default DetailWithdraw;