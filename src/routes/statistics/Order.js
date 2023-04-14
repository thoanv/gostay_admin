import React, { useState, useEffect } from 'react';
import { Card, message, Button, Divider, DatePicker, Spin, Table, Row, Col, Select, Tabs } from 'antd';
import { getStatisticOrder } from '../../actions/StatisticAction';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { ExportCSV } from '../../components/ExportExcel';
import { formatStatusOrder } from '../../components/StatusOrderFilter';
import OrderDetail from './OrderDetail';

const { Option } = Select;

const { RangePicker } = DatePicker;

const { TabPane } = Tabs;

function getTotal(date, array) {
    for (let i = 0; i < array.length; i++) {
        if (date == array[i].date) return array[i].total;
    }
    return 0;
}

function getRecord(date, array) {
    for (let i = 0; i < array.length; i++) {
        if (date == array[i].date) return array[i];
    }
    return { flight_orders: 0, total: 0, transport_orders: 0, stay_orders: 0 };
}

function getSum(array) {
    var sumF = 0;
    var sumT = 0;
    var sumS = 0;
    var sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum = +sum + parseInt(array[i].total);
        sumF = +sumF + parseInt(array[i].flight_orders);
        sumT = +sumT + parseInt(array[i].transport_orders);
        sumS = +sumS + parseInt(array[i].stay_orders);
    }
    return { sum, sumF, sumT, sumS };
}


const this_year = new Date().getFullYear();
const this_month = new Date().getMonth();
var last_month = this_month == 0 ? 11 : this_month - 1;
const today = moment().format("YYYY-MM-DD");
const last_30_day = moment().subtract(29, 'days').format("YYYY-MM-DD");
const last_7_day = moment().subtract(6, 'days').format("YYYY-MM-DD");
const start_this_month = moment().startOf('month').format("YYYY-MM-DD");
const end_this_month = moment().endOf('month').format("YYYY-MM-DD");
const start_last_month = moment(`${this_year}-${last_month + 1}`).startOf('month').format("YYYY-MM-DD");
const end_last_month = moment(`${this_year}-${last_month + 1}`).endOf('month').format("YYYY-MM-DD");
const array_day_this_month = Array.from({ length: moment().daysInMonth() }, (x, i) => moment().startOf('month').add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_month = Array.from({ length: moment(`${this_year}-${last_month + 1}`).daysInMonth() }, (x, i) => moment(`${this_year}-${last_month + 1}`).startOf('month').add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_7_day = Array.from({ length: 7 }, (x, i) => moment(last_7_day).add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_30_day = Array.from({ length: 30 }, (x, i) => moment(last_30_day).add(i, 'days').format('YYYY-MM-DD'));

const columns = [
    {
        title: 'Ngày',
        dataIndex: 'date',
        sorter: (a, b) => {
            let date_a = new Date(a.date).getTime();
            let date_b = new Date(b.date).getTime();
            return date_a - date_b
        },
    },
    {
        title: 'Đơn hàng Lưu trú',
        dataIndex: 'stay_orders',
        sorter: (a, b) => a.stay_orders - b.stay_orders,
    },
    {
        title: 'Đơn hàng Di chuyển',
        dataIndex: 'transport_orders',
        sorter: (a, b) => a.transport_orders - b.transport_orders,
    },
    {
        title: 'Đơn hàng vé máy bay',
        dataIndex: 'flight_orders',
        sorter: (a, b) => a.flight_orders - b.flight_orders,
    },
    {
        title: 'Tổng',
        dataIndex: 'total',
        sorter: (a, b) => a.total - b.total,
    }
]

function Order(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ start_date: last_30_day, end_date: today, type: "LAST_30_DAYS", order_type: "", order_status: '' });


    useEffect(() => {
        setLoading(true)
        getStatisticOrder(filter).then(res => {
            setData(res.result);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, [filter])


    const setDataChart = () => {
        switch (filter.type) {
            case "THIS_MONTH": {
                return array_day_this_month.map(item => {
                    return {
                        name: "order",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_MONTH": {
                return array_day_last_month.map(item => {
                    return {
                        name: "order",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_7_DAYS": {
                return array_day_last_7_day.map(item => {
                    return {
                        name: "order",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_30_DAYS": {
                return array_day_last_30_day.map(item => {
                    return {
                        name: "order",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "CUSTOM": {
                var length = (moment(`${filter.end_date} 00:00:00`).valueOf() - moment(`${filter.start_date} 00:00:00`).valueOf()) / 86400000;
                var array_custom = Array.from({ length }, (x, i) => moment(filter.start_date).add(i, 'days').format('YYYY-MM-DD'));
                return array_custom.map(item => {
                    return {
                        name: "order",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            default: return [];
        }
    }

    const setDataTable = () => {
        switch (filter.type) {
            case "THIS_MONTH": {
                return array_day_this_month.map(item => {
                    return {
                        date: item,
                        ...getRecord(item, data)
                    }
                })
            }
            case "LAST_MONTH": {
                return array_day_last_month.map(item => {
                    return {
                        date: item,
                        ...getRecord(item, data)
                    }
                })
            }
            case "LAST_7_DAYS": {
                return array_day_last_7_day.map(item => {
                    return {
                        date: item,
                        ...getRecord(item, data)
                    }
                })
            }
            case "LAST_30_DAYS": {
                return array_day_last_30_day.map(item => {
                    return {
                        date: item,
                        ...getRecord(item, data)
                    }
                })
            }
            case "CUSTOM": {
                var length = (moment(`${filter.end_date} 00:00:00`).valueOf() - moment(`${filter.start_date} 00:00:00`).valueOf()) / 86400000;
                var array_custom = Array.from({ length }, (x, i) => moment(filter.start_date).add(i, 'days').format('YYYY-MM-DD'));
                return array_custom.map(item => {
                    return {
                        date: item,
                        ...getRecord(item, data)
                    }
                })
            }
            default: return [];
        }
    }

    const option = {
        data: setDataChart(),
        xField: 'date',
        yField: 'total',
        seriesField: 'name',
        // yAxis: {
        //     label: {
        //         formatter: (v) => v.toFixed(1),
        //     },
        // },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
    }

    const footer = () => {
        var { sum, sumF, sumT, sumS } = getSum(data);
        return (
            <p style={{ marginTop: "20px" }}><b style={{ marginRight: "20px" }}>Tổng cộng: {sum}</b><b style={{ marginRight: "20px" }}> Stay: {sumS}</b><b style={{ marginRight: "20px" }}>Transport: {sumT}</b><b style={{ marginRight: "20px" }}>Flight: {sumF}</b></p>
        )
    }
    const setDataExport = () => {
        var arr = setDataTable();
        arr.unshift({ date: "Ngày", stay_orders: 'Đơn hàng Lưu trú', flight_orders: "Đơn hàng vé máy bay", transport_orders: "Đơn hàng di chuyển", total: "Tổng cộng" })
        return arr;
    }

    return (
        <div>
            <PageTitleBar
                title={"Đơn hàng"}
            />
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Tổng quát" key="1">
                        <Spin spinning={loading}>
                            <Row type="flex" justify="space-between">
                                <Col></Col>
                                <Col style={{ padding: "16px 0px" }}>
                                    <ExportCSV
                                        csvData={setDataExport()}
                                        fileName={`Báo cáo đơn hàng ${filter.order_type} ${filter.order_status ? formatStatusOrder(filter.order_status) : ""} từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
                                    />
                                </Col>
                            </Row>
                            <div style={{ display: "flex", marginBottom: "20px" }}>
                                <Button
                                    type={filter.type == "LAST_30_DAYS" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, start_date: last_30_day, end_date: today, type: "LAST_30_DAYS" } })}
                                >30 ngày gần nhất</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.type == "LAST_7_DAYS" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, start_date: last_7_day, end_date: today, type: "LAST_7_DAYS" } })}
                                >7 ngày gần nhất</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.type == "LAST_MONTH" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, start_date: start_last_month, end_date: end_last_month, type: "LAST_MONTH" } })}
                                >Tháng trước</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.type == "THIS_MONTH" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, start_date: start_this_month, end_date: end_this_month, type: "THIS_MONTH" } })}
                                >Tháng này</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <RangePicker
                                    value={[moment(filter.start_date), moment(filter.end_date)]}
                                    onOk={() => { }}
                                    onChange={(d, dstr) => setFilter(filter => { return { ...filter, start_date: dstr[0], end_date: dstr[1], type: "CUSTOM" } })}
                                />
                            </div>
                            <div style={{ display: "flex", marginBottom: "20px" }}>
                                <Button
                                    type={filter.order_type === "" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, order_type: "" } })}
                                >Tất cả</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.order_type == "FLIGHT" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, order_type: "FLIGHT" } })}
                                >Vé máy bay</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.order_type == "STAY" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, order_type: "STAY" } })}
                                >Lưu trú</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Button
                                    type={filter.order_type == "CAR" ? "primary" : "default"}
                                    onClick={() => setFilter(filter => { return { ...filter, order_type: "CAR" } })}
                                >Di chuyển</Button>
                                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                                <Select
                                    style={{ width: "250px" }}
                                    value={filter.order_status}
                                    placeholder={"Chọn trạng thái đơn hàng"}
                                    onChange={(v) => setFilter(filter => { return { ...filter, order_status: v } })}
                                // allowClear
                                >
                                    <Option value={''}>{"Tất cả trạng thái"}</Option>
                                    <Option value={'ORDER_CONFIRMED'}>{'Đã xác nhận'}</Option>
                                    <Option value={'ORDER_COMPLETED'}>{'Đã hoàn thành'}</Option>
                                    <Option value={'ORDER_CANCELLED'}>{'Đã huỷ'}</Option>
                                </Select>

                            </div>
                            <Line  {...option} />
                            <div style={{ marginBottom: "40px" }}></div>
                            <Table
                                columns={columns}
                                dataSource={setDataTable()}
                                size={"small"}
                                rowKey={"date"}
                                footer={footer}
                            />
                        </Spin>
                    </TabPane>
                    <TabPane tab="Chi tiết" key="2">
                        <OrderDetail />
                    </TabPane>

                </Tabs>

            </Card>
        </div>
    )
}

export default Order;