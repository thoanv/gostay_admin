import React, { useState, useEffect } from 'react';
import { Card, message, Button, Divider, DatePicker, Spin, Table, Row, Col, Select } from 'antd';
import { getStatisticCusomerOrder } from '../../actions/StatisticAction';
import moment from 'moment';
import { priceInVn } from '../../helpers/helpers';
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { ExportCSV } from '../../components/ExportExcel';
import { formatStatusOrder } from '../../components/StatusOrderFilter';

const { RangePicker } = DatePicker;


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
        title: 'Mã khách hàng',
        dataIndex: 'cid',
        sorter: true,
    },
    {
        title: 'Đơn hàng FLIGHT',
        dataIndex: 'flight_orders',
    },
    {
        title: 'Đơn hàng STAY',
        dataIndex: 'stay_orders',
    },
    {
        title: 'Đơn hàng TRANSPORT',
        dataIndex: 'transport_orders',
    },
    {
        title: 'Tổng đơn hàng',
        dataIndex: 'total_order',
    },
    {
        title: 'Doanh thu',
        dataIndex: 'subtotal',
        render: text => priceInVn(+text),
    },
    {
        title: 'Hoàn, huỷ',
        render: (text, record) => priceInVn(+record.subtotal - record.total),
    },
    {
        title: 'Doanh thu thuần',
        dataIndex: 'total',
        render: text => priceInVn(+text),
    },

]

function Customer(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ list: [], paging: { page: 1, count: 1, totalpage: 1, perpage: 1 } });
    const [filter, setFilter] = useState({
        start_date: last_30_day,
        end_date: today,
        type: "LAST_30_DAYS",
        paging: {
            page: 1,
            perpage: 15
        },
    });


    useEffect(() => {
        setLoading(true)
        getStatisticCusomerOrder(filter).then(res => {
            setData(res);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, [filter])

    const setDataExport = () => {
        var arr = [{
            cid: "Mã khách hàng",
            flight_orders: 'Đơn hàng FLIGHT',
            stay_orders: 'Đơn hàng STAY',
            transport_orders: 'Đơn hàng TRANSPORT',
            total_order: 'Tổng đơn hàng',
            subtotal: 'Doanh thu',
            cancel: 'Hoàn, huỷ',
            total: 'Doanh thu thuần',
        }];
        getStatisticCusomerOrder({ ...filter, nopaging: 1 }).then(res => {
            let { list } = res;
            arr.push(...list);
            return arr;
        }).catch(err => {
            return arr;
        })

    }

    const getOrder = (order) => {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    const onChangeTable = (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
        setFilter(filter => {
            return {
                ...filter,
                paging: {
                    page: pagination.current,
                    perpage: pagination.pageSize
                },
                sort: {
                    type: getOrder(sorter.order),
                    attr: sorter.columnKey
                }
            }
        })
    }



    return (
        <div>
            <PageTitleBar
                title={"Khách hàng"}
            />
            <RctCollapsibleCard>
                <Spin spinning={loading}>
                    <Row type="flex" justify="space-between">
                        <Col></Col>
                        <Col style={{ padding: "16px 0px" }}>
                            <ExportCSV
                                csvData={setDataExport()}
                                fileName={`Báo cáo doanh thu theo khách hàng từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
                            />
                        </Col>
                    </Row>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        <Button
                            type={filter.type == "ALL" ? "primary" : "default"}
                            onClick={() => setFilter(filter => { return { ...filter, start_date: null, end_date: null, type: "ALL" } })}
                        >Tất cả</Button>
                        <Divider type="vertical" style={{ height: "auto" }}></Divider>
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
                            value={[filter.start_date ? moment(filter.start_date) : null, filter.end_date ? moment(filter.end_date) : null]}
                            onOk={() => { }}
                            onChange={(d, dstr) => setFilter(filter => { return { ...filter, start_date: dstr[0], end_date: dstr[1], type: "CUSTOM" } })}
                        />
                    </div>


                    <Table
                        columns={columns}
                        dataSource={data.list}
                        size={"small"}
                        rowKey={"cid"}
                        bordered
                        pagination={{
                            pageSizeOptions: ["15", "30", "50"],
                            total: data.paging.count,
                            showSizeChanger: true,
                            current: filter.paging.page,
                            pageSize: filter.paging.perpage
                        }}
                        onChange={onChangeTable}
                    />
                </Spin>
            </RctCollapsibleCard>
        </div>
    )
}

export default Customer;