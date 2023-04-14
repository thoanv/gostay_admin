import React, { useState, useEffect } from 'react';
import { Card, message, Button, Divider, DatePicker, Spin, Table, Row, Col, Select } from 'antd';
import { getStatisticRevenue } from '../../actions/StatisticAction';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import { priceInVn } from '../../helpers/helpers';
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
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
        if (date == array[i].date) return { ...array[i], cancel: array[i].subtotal - array[i].total };
    }
    return { discount: 0, total: 0, supplier_earning: 0, subtotal: 0, cancel: 0 };
}

function getSum(array) {
    var sumD = 0;
    var sumS = 0;
    var sum = 0;
    var sumT = 0;
    for (let i = 0; i < array.length; i++) {
        sum = sum + parseInt(array[i].total);
        sumT = sumT + parseInt(array[i].subtotal);
        sumD = sumD + parseInt(array[i].discount);
        sumS = sumS + parseInt(array[i].supplier_earning);
    }
    return { sum, sumD, sumS, sumT };
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
        title: 'Tổng tiền',
        children: [
            {
                title: 'Doanh thu',
                dataIndex: 'subtotal',
                sorter: (a, b) => + a.subtotal - b.subtotal,
                render: text => priceInVn(+text),
            },
            {
                title: 'Hoàn, huỷ',
                render: (text, record) => priceInVn(+record.subtotal - record.total),
            },
            {
                title: 'Doanh thu thuần',
                dataIndex: 'total',
                sorter: (a, b) => + a.total - b.total,
                render: text => priceInVn(+text),
            },
        ]
    },
    {
        title: 'Hoa hồng',
        dataIndex: 'discount',
        sorter: (a, b) => +a.discount - b.discount,
        render: text => priceInVn(+text)
    },
    {
        title: 'Host thu',
        dataIndex: 'supplier_earning',
        sorter: (a, b) => + a.supplier_earning - b.supplier_earning,
        render: text => priceInVn(+text)
    }
]

function Revenue(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ start_date: last_30_day, end_date: today, type: "LAST_30_DAYS", order_type: "", order_status: '' });


    useEffect(() => {
        setLoading(true)
        getStatisticRevenue(filter).then(res => {
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
                        name: "revenue",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_MONTH": {
                return array_day_last_month.map(item => {
                    return {
                        name: "revenue",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_7_DAYS": {
                return array_day_last_7_day.map(item => {
                    return {
                        name: "revenue",
                        date: item,
                        total: getTotal(item, data)
                    }
                })
            }
            case "LAST_30_DAYS": {
                return array_day_last_30_day.map(item => {
                    return {
                        name: "revenue",
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
                        name: "revenue",
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
        yAxis: {
            label: {
                formatter: (v) => priceInVn(v),
            },
        },
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
        var { sum, sumD, sumS, sumT } = getSum(data);
        return (
            <p style={{ marginTop: "20px" }}>
                <b style={{ marginRight: "20px" }}>Doanh thu: {priceInVn(sumT)}</b>
                <b style={{ marginRight: "20px" }}>Hoàn huỷ: {priceInVn(sumT - sum)}</b>
                <b style={{ marginRight: "20px" }}>Doanh thu thuần: {priceInVn(sum)}</b>
                <b style={{ marginRight: "20px" }}> Hoa hồng: {priceInVn(sumD)}</b>
                <b style={{ marginRight: "20px" }}> Host thu: {priceInVn(sumS)}</b>
            </p>
        )
    }

    const setDataExport = () => {
        var arr = setDataTable();
        arr.unshift({
            date: "Ngày",
            subtotal: "Doanh thu",
            cancel: "Hoàn huỷ",
            total: "Doanh thu thuần",
            discount: "Hoa hồng",
            supplier_earning: "Host thu",
        })
        return arr;
    }

    return (
        <div>
            <PageTitleBar
                title={"Doanh thu"}
            />
            <RctCollapsibleCard>
                <Spin spinning={loading}>
                    <Row type="flex" justify="space-between">
                        <Col></Col>
                        <Col style={{ padding: "16px 0px" }}>
                            <ExportCSV
                                csvData={setDataExport()}
                                fileName={`Báo cáo doanh thu ${filter.order_type} ${filter.order_status ? formatStatusOrder(filter.order_status) : ""} ${filter.supplier_id ? `supplier_id: ${filter.supplier_id}` : ""} ${filter.object_id ? `object_id: ${filter.object_id}` : ""} từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
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
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        {filter.order_type == "STAY" || filter.order_type == "CAR" ?
                            <React.Fragment>
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
                        bordered
                    />
                </Spin>
            </RctCollapsibleCard>
        </div>
    )
}

export default Revenue;