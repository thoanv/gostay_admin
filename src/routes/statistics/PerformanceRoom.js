import React, { useState, useEffect } from 'react';
import { message, Button, Divider, DatePicker, Spin, Table, Row, Col } from 'antd';
import { getRoomPerformance } from '../../actions/StatisticAction';
import moment from 'moment';
import { ExportCSV } from '../../components/ExportExcel';
import { SearchSupplier } from './SearchSupplier';
import { SearchRoom } from './SearchRoom';


const { RangePicker } = DatePicker;


function getRecord(length, array) {
    return array.map(item => {
        return {
            object_id: item.object_id,
            performance: Math.round(item.total / length * 100)
        }
    })
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
        title: 'Mã phòng',
        dataIndex: 'object_id',
        sorter: (a, b) => a.object_id - b.object_id,

    },
    {
        title: 'Công suất bán phòng',
        dataIndex: 'performance',
        sorter: (a, b) => a.performance - b.performance,
        render: text => `${text}%`
    }
]

function PerformanceRoom(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ start_date: last_30_day, end_date: today, type: "LAST_30_DAYS" });


    useEffect(() => {
        setLoading(true)
        getRoomPerformance(filter).then(res => {
            setData(res.result);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, [filter])

    const setDataTable = () => {
        switch (filter.type) {
            case "THIS_MONTH": {
                return getRecord(array_day_this_month.length, data);
            }
            case "LAST_MONTH": {
                return getRecord(array_day_last_month.length, data);
            }
            case "LAST_7_DAYS": {
                return getRecord(array_day_last_7_day.length, data);
            }
            case "LAST_30_DAYS": {
                return getRecord(array_day_last_30_day.length, data);
            }
            case "CUSTOM": {
                var length = (moment(`${filter.end_date} 00:00:00`).valueOf() - moment(`${filter.start_date} 00:00:00`).valueOf()) / 86400000;
                var array_custom = Array.from({ length }, (x, i) => moment(filter.start_date).add(i, 'days').format('YYYY-MM-DD'));
                return getRecord(array_custom.length, data);
            }
            default: return [];
        }
    }

    const setDataExport = () => {
        var arr = setDataTable();
        arr.unshift({ object_id: "Mã phòng", performance: 'Công suất bán phòng (%)' })
        return arr;
    }

    console.log(data)

    return (
        <Spin spinning={loading}>
            <Row type="flex" justify="space-between">
                <Col></Col>
                <Col style={{ padding: "16px 0px" }}>
                    <ExportCSV
                        csvData={setDataExport()}
                        fileName={`Báo cáo công suất bán phòng từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
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
                <SearchSupplier
                    supplier_id={filter.supplier_id}
                    onChange={(v) => setFilter(filter => { return { ...filter, supplier_id: v } })}
                />
                <Divider type="vertical" style={{ height: "auto" }}></Divider>
                <SearchRoom
                    supplier_id={filter.supplier_id}
                    onChange={(v) => setFilter(filter => { return { ...filter, object_id: v } })}
                    object_id={filter.object_id}
                />
            </div>
            <div style={{ marginBottom: "40px" }}></div>
            <Table
                columns={columns}
                dataSource={setDataTable()}
                size={"small"}
                rowKey={"object_id"}
            />
        </Spin>
    )
}

export default PerformanceRoom;