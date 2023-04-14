import React, { Component, useState, useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import TableActionBar from "../../../components/TableActionBar";
import { Table, Tag, Card, Spin, Avatar, Button, Modal, DatePicker } from "antd";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { getWithdraw, withdrawApprove, getWithdrawDetail } from '../../../actions/WithdrawAction';
import { Link } from 'react-router-dom';
import DetailWithdraw from './DetailWithdraw';


function useFetchWithdraw(filter, reload) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ list: [], paging: { count: 0, totalPage: 1, perpage: 1, page: 1 } });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                var data = await getWithdraw(filter);
                setLoading(false);
                setData(data)
            } catch (error) {
                setLoading(false);
                setData({ list: [], paging: { count: 0, totalPage: 1, perpage: 1, page: 1 } });
            }
        }
        fetchData();
    }, [filter, reload])
    return { data, loading }
}

function Withdraw() {

    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const { data, loading } = useFetchWithdraw(filter, reload);
    console.log("data", data)

    const columns = [
        {
            title: <IntlMessages id='global.status' />,
            dataIndex: 'status',
            align: 'center',
            key: 'status',
            render: status => {
                if (status == 'PENDING') return <Tag color='orange'><IntlMessages id='global.transaction_pending' /></Tag>
                if (status == 'APPROVED') return <Tag color='green'><IntlMessages id='global.transaction_approved' /></Tag>
                return <Tag color='red'><IntlMessages id='global.transaction_declined' /></Tag>
            }
        },
        {
            title: <IntlMessages id='global.type' />,
            dataIndex: 'type',
            align: 'center',
            key: 'type',
            render: status => {
                if (status == 'STAY') return <Tag color='orange'><IntlMessages id='global.stay' /></Tag>
                return <Tag color='red'><IntlMessages id='global.car' /></Tag>
            }
        },
        {
            title: <IntlMessages id="global.supplier" />,
            key: "customer",
            align: "left",
            render: (record) =>
                record.sup_firstname || record.sup_lastname ? (

                    `${record.sup_firstname} ${record.sup_lastname}`

                ) : (
                        "Supplier"
                    ),
        },
        {
            title: <IntlMessages id="global.bank_account_number" />,
            key: "bank_account_number",
            dataIndex: "bank_account_number",
            align: "center",
        },
        {
            title: <IntlMessages id="global.bank_account_name" />,
            key: "bank_account_name",
            dataIndex: "bank_account_name",
            align: "center",
        },
        {
            title: <IntlMessages id="global.bank_name" />,
            key: "bank_name",
            dataIndex: "bank_name",
            align: "center",
            render: (text, record) => (<span>{text}, Chi nhánh{' '}{record.bank_branch}{", "}{record.bank_city}</span>)
        },
        {
            title: <IntlMessages id="transaction.amount" />,
            key: "amount",
            sorter: true,
            dataIndex: "amount",
            align: "center",
            render: (text, record) => {
                return (
                    <NumberFormat value={+record.amount} thousandSeparator={true} displayType="text" suffix=" đ" />
                );
            },
        },
        {
            title: <IntlMessages id="transaction.created_at" />,
            dataIndex: "created_at",
            key: "created_at",
            align: 'center',
            render: (text, record) => (
                <React.Fragment>
                    <div>{moment(record.created_at).format("HH:mm")}</div>
                    <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                </React.Fragment>
            ),
            sorter: true
        },
        {
            title: <IntlMessages id="global.detail" />,
            dataIndex: "updated_at",
            render: (text, record) => (
                <Tag color="green" onClick={() => setOpen(record)}><IntlMessages id="global.detail" /></Tag>
            ),
        },


    ];

    const listStatusfilter = [
        {
            id: 'APPROVED',
            title: <span><IntlMessages id='global.transaction_approved' /></span>
        },
        {
            id: 'PENDING',
            title: <span><IntlMessages id='global.transaction_pending' /></span>
        },
        {
            id: 'DECLINED',
            title: <span><IntlMessages id='global.transaction_declined' /></span>
        }
    ]


    const [filter, setFilter] = useState({
        sort: {
            type: "desc",
            attr: "",
        },
        paging: {
            perpage: 10,
            page: 1,
        },
        search: "",
    });

    const getOrder = (order) => {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    const onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        setFilter({
            ...filter,
            sort: {
                type: getOrder(sorter.order),
                attr: sorter.columnKey,
            },
            paging: {
                perpage: pagination.pageSize,
                page: pagination.current,
            },
        })

    }

    const onFilter = (value, name, type) => {
        if (type === "search") {
            setFilter({
                ...filter,
                search: value,
            })
        } else {
            setFilter({
                ...this.state.filter,
                [name]: {
                    type: "=",
                    value: value,
                },
            });
        }
    }

    return (
        <React.Fragment>
            <div className="formelements-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.transaction" />}
                />
                <TableActionBar
                    textSearch={false}
                    isShowAddButton={false}
                    isShowPublishButtons={false}
                    isShowCopyButton={false}
                    isShowDeleteButton={false}
                    onFilter={onFilter}
                    data={[

                        {
                            name: "status",
                            data: listStatusfilter,
                            placeholder: "Chọn trạng thái",
                        },

                    ]}
                >
                </TableActionBar>
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
                    }}
                />
            </div>
            <DetailWithdraw
                withdraw={open}
                onClose={() => setOpen(false)}
                open={!!open}
                onReload={() => setReload(reload => !reload)}
            />
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        config: state.config,
    };
};

export default connect(mapStateToProps, null)(Withdraw);