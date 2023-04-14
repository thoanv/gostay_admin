import React, { useState } from 'react';
import { Table, Icon, Spin, Avatar } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getAllSubcribers } from '../../../actions/SubcribersActions';

class Subscriber extends React.PureComponent {

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
        filter: {
            paging: {
                perpage: 10,
                page: 1,
            },
        }
    }

    componentDidMount() {
        this.props.getAllSubcribers(this.state.filter);
        this.setState({
            isLoading: false
        })
    }

    filter = (value, name, type) => {

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
                this.setState({ isLoading: false })
                await this.props.getAllSubcribers(this.state.filter);
                this.setState({ isLoading: false })
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
                await this.props.getAllSubcribers(this.state.filter);
                this.setState({ isLoading: false })
            }
        );
    };

    render() {
        const { subscribers, paging, config } = this.props;

        const columns = [
            {
                title: <IntlMessages id="global.user" />,
                key: "user_id",
                render: (text, record) => {
                    return (
                        <div className="d-flex align-items-center">
                            <Avatar src={record.image ? config.url_asset_root + record.image : config.url_asset_root + 'backup.png'} size={40} />
                            <div className="ml-2"><b>{record.firstname ? (record.firstname + " " + record.lastname) : record.email || record.phone}</b></div>
                        </div>
                    )
                }
            },
            {
                title: <IntlMessages id="global.device_id" />,
                key: 'device_id',
                dataIndex: "device_id",
            },
            {
                title: <IntlMessages id="global.os" />,
                dataIndex: "os",
                key: "os",
                align: 'center',
                render: (text, record) => {
                    switch (text) {
                        case 'IOS': return <Icon type="apple" style={{ fontSize: 20 }} />;
                        case 'ANDROIDOS': return <Icon type="android" style={{ fontSize: 20 }} />;
                        case 'DESKTOP': return <Icon type="desktop" style={{ fontSize: 20 }} />;
                        default: return <Icon type="desktop" />;
                    }
                }
            },
            {
                title: <IntlMessages id="global.created_at" />,
                // dataIndex: "id",
                key: "created_at",
                align: 'center',
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
                            title={<IntlMessages id="sidebar.subscriber" />}
                            match={this.props.match}
                        />
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <TableActionBar
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
                                            name: "os",
                                            data: [
                                                { id: 'IOS', title: 'iOS' },
                                                { id: 'ANDROIDOS', title: 'Android' },
                                                { id: 'DESKTOP', title: 'Desktop' },
                                            ],
                                            placeholder: "Hệ điều hành"
                                        }
                                    ]}
                                    justify="end"
                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    columns={columns}
                                    dataSource={subscribers}
                                    rowKey="id"
                                    size="small"
                                    pagination={{
                                        current: parseInt(paging.page),
                                        pageSize: parseInt(paging.perpage),
                                        total: parseInt(paging.count)
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
        subscribers: state.subcribers.listSubcribers,
        paging: state.subcribers.paging,
        config: state.config
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllSubcribers: (filter) => dispatch(getAllSubcribers(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriber);