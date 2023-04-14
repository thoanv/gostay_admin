import React, { useState } from 'react';
import { Table, Button, Modal, Tabs, Spin, DatePicker, Select } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import { getAllACCOUNT, uactivity } from '../../../actions/AccountAction';

const { Option } = Select;


class UActivity extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        openModalRecipents: false,
        cItem: null,
        openModalPreview: false,
        openModalForm: false,
        isLoading: false,
        openModalSchedule: false,
        list: [],
        filterAll: { paging: 0 },
        filter: {
            paging: {
                perpage: 10,
                page: 1,
            },
        }
    }

    componentDidMount() {
        this.props.getAllCustomer(this.state.filterAll, "registered");
        this.setState({
            isLoading: false
        })
        uactivity(this.state.filter).then(data => {
            this.setState({
                list: data.list,
                filter: {
                    ...this.state.filter,
                    paging: data.paging
                }
            })

        })

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
                    await uactivity(this.state.filter);
                    this.setState({ isLoading: false })
                }
            );
        } else
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
                    uactivity(this.state.filter).then(result => {
                        this.setState({ list: result.list, isLoading: false, filter: { ...this.state.filter, paging: result.paging } })
                    });

                }
            );
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
        const { listCustomer } = this.props;
        const customers = [];
        listCustomer.map(item => {
            let name = `${item.firstname || ''} ${item.lastname || ''}`;
            customers.push({
                id: item.id,
                title: `${name.length < 2 ? item.email || item.mobile : name}`
            })
        });

        const columns = [
            {
                title: <IntlMessages id="global.user" />,
                key: "user",
                render: (text, record) => {
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} >{`${record.firstname || ''} ${record.lastname || ''}`} </b>
                    )
                }
            },
            {
                title: <IntlMessages id="global.title" />,
                key: 'title',
                render: (text, record) => {
                    let { object } = record;
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { }} >{object ? object.title : ''} </b>
                    )
                }
            },

            {
                title: <IntlMessages id="global.type" />,
                dataIndex: "type",
                key: "type",
                render: (type, record) => {
                    if (type == "SEARCH")
                        return (
                            <b style={{ cursor: "pointer" }}  >{"Tìm kiếm"} </b>
                        )
                    else if (type == "VIEW") {
                        return (
                            <b style={{ cursor: "pointer" }}  >{"Xem"} </b>
                        )
                    }
                }
            },
            {
                title: <IntlMessages id="global.count" />,
                dataIndex: "times",
                key: "times",
                className: "center-column",
                sorter: true
            },
            {
                title: <IntlMessages id="global.recent" />,
                // dataIndex: "id",
                key: "created",
                className: "center-column",
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.updated_at).format("DD/MM/YYYY HH:mm")}</div>
                    </React.Fragment>
                )
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
                            title={<IntlMessages id="sidebar.uactivity" />}
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
                                            placeholder: <IntlMessages id="global.select_user" />,
                                        },
                                        {
                                            name: "type",
                                            data: [
                                                {id: 'VIEW', title: "Xem"},
                                                {id: 'SEARCH', title: "Tìm kiếm"}
                                            ],
                                            placeholder: "Loại hành vi"
                                        },
                                    ]}
                                    justify="end"
                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    columns={columns}
                                    dataSource={this.state.list}
                                    rowKey="id"
                                    size="small"
                                    pagination={{
                                        pageSize: 10
                                    }}
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
        listCustomer: state.account.listAccount
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCustomer: (filter, type) => dispatch(getAllACCOUNT(filter, type))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UActivity);