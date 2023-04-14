import React, { useState, useEffect } from 'react';
import { Card, message, Button, Divider, DatePicker, Spin, Table, Row, Col, Select } from 'antd';
import { getStatisticOrderDetail } from '../../actions/StatisticAction';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import { ExportCSV } from '../../components/ExportExcel';
import { formatStatusOrder } from '../../components/StatusOrderFilter';
import { SearchSupplier } from './SearchSupplier';
import { SearchRoom } from './SearchRoom';
import { SearchRoute } from './SearchRoute';

const { Option } = Select;

const { RangePicker } = DatePicker;

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
    return { ORDER_CONFIRMED: 0, total: 0, ORDER_CANCELLED: 0, ORDER_COMPLETED: 0 };
}

function getSum(array) {
    var sumConfirm = 0;
    var sumComplete = 0;
    var sumCancel = 0;
    var sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum = +sum + parseInt(array[i].total);
        sumConfirm = +sumConfirm + parseInt(array[i].ORDER_CONFIRMED);
        sumComplete = +sumComplete + parseInt(array[i].ORDER_COMPLETED);
        sumCancel = +sumCancel + parseInt(array[i].ORDER_CANCELLED);
    }
    return { sum, sumConfirm, sumCancel, sumComplete };
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
        title: 'Đã xác nhận',
        dataIndex: 'ORDER_CONFIRMED',
        sorter: (a, b) => a.ORDER_CONFIRMED - b.ORDER_CONFIRMED,
    },
    {
        title: 'Đã hoàn thành',
        dataIndex: 'ORDER_COMPLETED',
        sorter: (a, b) => a.ORDER_COMPLETED - b.ORDER_COMPLETED,
    },
    {
        title: 'Đơn đã huỷ',
        dataIndex: 'ORDER_CANCELLED',
        sorter: (a, b) => a.ORDER_CANCELLED - b.ORDER_CANCELLED,
    },
    {
        title: 'Tổng',
        dataIndex: 'total',
        sorter: (a, b) => a.total - b.total,
    }
]

function OrderDetail(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ start_date: last_30_day, end_date: today, type: "LAST_30_DAYS", order_type: "FLIGHT" });


    useEffect(() => {
        setLoading(true)
        getStatisticOrderDetail(filter).then(res => {
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
        var { sum, sumConfirm, sumCancel, sumComplete } = getSum(data);
        return (
            <p style={{ marginTop: "20px" }}><b style={{ marginRight: "20px" }}>Tổng cộng: {sum}</b><b style={{ marginRight: "20px" }}> Đã xác nhận: {sumConfirm}</b><b style={{ marginRight: "20px" }}>Đã hoàn thành: {sumComplete}</b><b style={{ marginRight: "20px" }}>Đã huỷ: {sumCancel}</b></p>
        )
    }
    const setDataExport = () => {
        var arr = setDataTable();
        arr.unshift({ date: "Ngày", ORDER_CONFIRMED: 'Đơn hàng đã xác nhận', ORDER_COMPLETED: "Đơn hàng đã hoàn thành", ORDER_CANCELLED: "Đơn hàng đã huỷ", total: "Tổng cộng" })
        return arr;
    }

    return (
        <Spin spinning={loading}>
            <Row type="flex" justify="space-between">
                <Col></Col>
                <Col style={{ padding: "16px 0px" }}>
                    <ExportCSV
                        csvData={setDataExport()}
                        fileName={`Báo cáo đơn hàng ${filter.order_type} từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
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
                {filter.order_type == "STAY" || filter.order_type == "CAR" ?
                    <React.Fragment>
                        <Divider type="vertical" style={{ height: "auto" }}></Divider>
                        <SearchSupplier
                            supplier_id={filter.supplier_id}
                            onChange={(v) => setFilter(filter => { return { ...filter, supplier_id: v } })}
                        />
                        <Divider type="vertical" style={{ height: "auto" }}></Divider>
                        {filter.order_type == "STAY" ?
                            <SearchRoom
                                supplier_id={filter.supplier_id}
                                onChange={(v) => setFilter(filter => { return { ...filter, object_id: v } })}
                                object_id={filter.object_id}
                            />
                            :
                            <SearchRoute
                                supplier_id={filter.supplier_id}
                                onChange={(v) => setFilter(filter => { return { ...filter, object_id: v } })}
                                object_id={filter.object_id}
                            />
                        }
                    </React.Fragment>
                    : null
                }
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
    )
}

export default OrderDetail;