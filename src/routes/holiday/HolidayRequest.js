import React, { useState } from 'react';
import { Table, Button, Modal, Tag, Spin, Icon, Select, Descriptions } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getAllHolidayExchanges } from '../../actions/HolidayAction';
import { getAllACCOUNT } from '../../actions/AccountAction';
import { priceInVn } from '../../helpers/helpers';
import renderHTML from "react-render-html";

class HolidayRequest extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        isLoading: false,
        filterAll: { paging: 0 },
        filter: {
            paging: {
                perpage: 10,
                page: 1,
            },
        },
        selectedItem: null
    }

    componentDidMount() {
        this.props.getAllCustomer(this.state.filterAll, "supplier");
        this.setState({
            isLoading: false
        })
        this.props.getAllHolidayExchanges(this.state.filter);

    }

    filter = (value, name, type) => {
        if (type === "search") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        search: value,
                    },
                },
                async () => {
                    await this.props.getAllHolidayExchanges(this.state.filter);
                    this.setState({ isLoading: false })
                }
            );
        } else {
            this.setState(
                {
                    ...this.state,
                    isLoading: true,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                },
                async () => {
                    this.props.getAllHolidayExchanges(this.state.filter).then(() => {
                        this.setState({ isLoading: false })
                    });

                }
            );
        }
    };

    onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        this.setState(
            {
                isLoading: true,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: pagination.pageSize,
                        page: pagination.current,
                    },
                },
            },
            async () => {
                await this.props.getAllReview(this.state.filter);
                this.setState({ isLoading: false })
            }
        );
    };

    render() {
        const { listCustomer, config, exchanges, paging } = this.props;
        var { selectedItem } = this.state;
        const customers = [];
        listCustomer.map(item => {
            let name = `${item.firstname || ''} ${item.lastname || ''}`;
            customers.push({
                id: item.id,
                title: `${name.length < 2 ? item.email || item.mobile : name}`
            })
        });

        console.log(this.state.filter)

        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "Bên yêu cầu",
                render: (text, record) => (
                    <div>
                        <div><a target="_blank" href={`http://2stay.vn/stay/${record.property_id}`}>{record.holiday_title}</a></div>
                        <div >{record.sup_firstname} {record.sup_lastname}</div>
                        <div >{record.sup_mobile} - {record.sup_email}</div>
                    </div>
                )
            },
            {
                title: "Bên nhận yêu cầu",
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <div>
                        <div><b><a target="_blank" href={`http://2stay.vn/stay/${record.receiver_property_id}`}>{record.receiver_property_title}</a></b></div>
                        <div>{record.receiver_firstname} {record.receiver_lastname}</div>
                        <div>{record.receiver_mobile} - {record.receiver_email}</div>
                    </div>
                )
            },
            {
                title: "Check-in",
                dataIndex: "check_in",
                key: "check_in",
                // width: 150,
                align: 'center',
                render: (text, record) => (
                        <div>{moment(record.check_in).format("DD/MM/YY")}</div>
                ),
                sorter: true
            },
    
            {
                title: "Check-out",
                dataIndex: "check_out",
                key: "check_out",
                // width: 150,
                align: 'center',
                render: (text, record) => (
                        <div>{moment(record.check_out).format("DD/MM/YY")}</div>
                ),
                sorter: true
            },
            {
                title: "Ghi chú",
                key: "notes",
                sorter: true,
                dataIndex: "notes",
                render: (text, record) => (
                        <p>{record.notes}</p>
                ),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (text, record) => {
                    if (text == 'rejected') return <Tag color="red">Từ chối</Tag>;
                    else if (text == 'accepted') return <Tag color="green">Đồng ý</Tag>;
                    else return <Tag color="gold">Chờ xử lý</Tag>;
                }
            },
            {
                title: "Tạo lúc",
                dataIndex: "created_at",
                key: "created_at",
                // width: 150,
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.created_at).format("HH:mm")}</div>
                        <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },
        ];

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <React.Fragment>
                <Spin tip="" spinning={this.state.isLoading}>
                    <div className="formelements-wrapper">
                        <PageTitleBar
                            title="Trao đổi kỳ nghỉ"
                            match={this.props.match}
                        />
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <TableActionBar
                                    onAdd={() => { this.onOpenModalForm() }}
                                    onDelete={() => { }}
                                    onRefresh={() => { }}
                                    isDisabled={!hasSelected}
                                    rows={this.state.selectedRowKeys}
                                    table=""
                                    isShowPublishButtons={false}
                                    isShowDeleteButton={false}
                                    textSearch={false}
                                    isShowAddButton={false}
                                    onFilter={this.filter}
                                    data={[
                                        {
                                            name: "cid",
                                            data: customers,
                                            placeholder: "Bên yêu cầu",
                                        },
                                        {
                                            name: "receiver_id",
                                            data: customers,
                                            placeholder: "Bên nhận yêu cầu",
                                        },
                                        {
                                            name: "status",
                                            data: [
                                                { id: 'pending', title: "Chờ xử lý" },
                                                { id: 'rejected', title: "Từ chối" },
                                                { id: 'accepted', title: "Đồng ý" }
                                            ],
                                            placeholder: "Trạng thái"
                                        },
                                    ]}
                                    justify="end"
                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    columns={columns}
                                    dataSource={exchanges}
                                    rowKey="id"
                                    size="small"
                                    pagination={paging}
                                    tableLayout="auto"
                                    onChange={this.onChangTable}
                                // scroll={{ x: 1500 }}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </div>
                </Spin>
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        listCustomer: state.account.listAccount,
        exchanges: state.holiday.exchanges,
        paging: state.holiday.exchangePaging,
        config: state.config
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCustomer: (filter, type) => dispatch(getAllACCOUNT(filter, type)),
        getAllHolidayExchanges: (filter) => dispatch(getAllHolidayExchanges(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HolidayRequest);