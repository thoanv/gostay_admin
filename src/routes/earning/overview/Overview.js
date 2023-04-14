import React, { Component, useState, useEffect } from 'react'
import { Table, message } from 'antd';
import IntlMessages from "Util/IntlMessages";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { getEarningData } from '../../../actions/EarningAction';
import { OrderStatus } from '../../../components/OrderStatus';
import FilterBar from '../../../components/FilterBar';


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
        title: <IntlMessages id='global.status' />,
        dataIndex: 'status',
        align: 'center',
        key: 'status',
        render: (status, record) => (
            <React.Fragment>
                <OrderStatus status={status} />
                {status == "ORDER_COMPLETED" ? record.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment><br />Có sử dụng dịch vụ</React.Fragment> : record.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment><br />Không sử dụng dịch vụ</React.Fragment> : null : null}
            </React.Fragment>
        )
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

function useGetData(filter) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ list: [], paging: { perpage: 10, page: 1, total: 1 } })

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                var data = await getEarningData(filter);
                setLoading(false);
                var { list } = data;
                list = list.map(item => {
                    let i = item;
                    delete i.children;
                    return i;
                })
                setData({ list, paging: data.paging });
            } catch (error) {
                setLoading(false);
                console.log(error)
                message.error("Có lỗi xảy ra, vui lòng thử lại")
            }
        }
        fetchData();
    }, [filter]);
    return { data, loading };
}


export function PendingTable() {

    const [filter, setFilter] = useState({
        paging: {
            perpage: 10,
            page: 1,
        },
        withdraw_type: "PENDING"
    });

    const { data, loading } = useGetData(filter);

    const onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        setFilter(filter => {
            return {
                ...filter,
                paging: {
                    perpage: pagination.pageSize,
                    page: pagination.current,
                }
            }
        });
    };


    const onFilter = (value, name, type) => {
        if (type === "search") {
            setFilter(filter => {
                return {
                    ...filter,
                    search: value,
                }
            });
        } else {
            setFilter(filter => {
                return {
                    ...filter,
                    type: value
                }
            });
        }
    }

    return (
        <div>
            <FilterBar
                textSearchPlaceholder="Mã BK"
                onFilter={onFilter}
                data={[
                    {
                        name: "type",
                        data: [{ id: "STAY", title: "Stay" }, { id: "CAR", title: "Transport" }],
                        placeholder: "Chọn loại đơn hàng",
                    },
                ]}
            ></FilterBar>
            <Table
                tableLayout="auto"
                columns={columns}
                dataSource={data.list}
                onChange={onChangTable}
                rowKey="id"
                size="small"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30"],
                    total: data.paging.count,
                    current: data.paging.page,
                    pageSize: data.paging.perpage
                }}
            />
        </div>
    )
}

export function AvailableTable() {

    const [filter, setFilter] = useState({
        paging: {
            perpage: 10,
            page: 1,
        },
        withdraw_type: "AVAILABLE"
    });

    const { data, loading } = useGetData(filter);

    const onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        setFilter(filter => {
            return {
                ...filter,
                paging: {
                    perpage: pagination.pageSize,
                    page: pagination.current,
                }
            }
        });
    };

    const onFilter = (value, name, type) => {
        if (type === "search") {
            setFilter(filter => {
                return {
                    ...filter,
                    search: value,
                }
            });
        } else {
            setFilter(filter => {
                return {
                    ...filter,
                    type: value
                }
            });
        }
    }

    return (
        <div>
            <FilterBar
                textSearchPlaceholder="Mã BK"
                onFilter={onFilter}
                data={[
                    {
                        name: "type",
                        data: [{ id: "STAY", title: "Stay" }, { id: "CAR", title: "Transport" }],
                        placeholder: "Chọn loại đơn hàng",
                    },
                ]}
            ></FilterBar>
            <Table
                tableLayout="auto"
                columns={columns}
                dataSource={data.list}
                onChange={onChangTable}
                rowKey="id"
                size="small"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30"],
                    total: +data.paging.count,
                    current: +data.paging.page,
                    pageSize: +data.paging.perpage
                }}
            />
        </div>
    )
}

export function PaidTable() {

    const [filter, setFilter] = useState({
        paging: {
            perpage: 10,
            page: 1,
        },
        withdraw_type: "PAID"
    });

    const { data, loading } = useGetData(filter);

    const onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        setFilter(filter => {
            return {
                ...filter,
                paging: {
                    perpage: pagination.pageSize,
                    page: pagination.current,
                }
            }
        });
    };

    const onFilter = (value, name, type) => {
        if (type === "search") {
            setFilter(filter => {
                return {
                    ...filter,
                    search: value,
                }
            });
        } else {
            setFilter(filter => {
                return {
                    ...filter,
                    type: value
                }
            });
        }
    }

    return (
        <div>
            <FilterBar
                textSearchPlaceholder="Mã BK"
                onFilter={onFilter}
                data={[
                    {
                        name: "type",
                        data: [{ id: "STAY", title: "Stay" }, { id: "CAR", title: "Transport" }],
                        placeholder: "Chọn loại đơn hàng",
                    },
                ]}
            ></FilterBar>
            <Table
                tableLayout="auto"
                columns={columns}
                dataSource={data.list}
                onChange={onChangTable}
                rowKey="id"
                size="small"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30"],
                    total: data.paging.count,
                    current: data.paging.page,
                    pageSize: data.paging.perpage
                }}
            />
        </div>
    )
}


