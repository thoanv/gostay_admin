import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import { getAllACCOUNT, createACCOUNT, updateACCOUNT, batchDelete } from '../../../actions/AccountAction';
import { Table, Modal, message, Button, Avatar } from 'antd';
import TableActionBar from '../../../components/TableActionBar';
import StatusButton from '../../../components/StatusButton';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

class ListAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                created_at: {
                    type: "compare",
                    value: {
                        from: "",
                        to: ""
                    }
                },
                title: {
                    type: "like",
                    value: ""
                },
                alias: {
                    type: "=",
                    value: []
                },
                search: "",
                paging: {
                    perpage: 10,
                    page: 1
                }
            },
            addAccountState: false,
            current_account: null,
            selectedRowKeys: [],
            isSubmiting: false,
            edit: false,
        }
    }

    componentDidMount() {
        this.props.getAllAdmin(this.state.filter, 'admin')

    }


    filter = (value, name, type) => {
        console.log(value)
        if (type === "search") {
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    search: value
                }
            }, () => this.props.getAllAdmin(this.state.filter, 'admin'))
        }
        else
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    [name]: {
                        type: "=",
                        value: value
                    }
                }
            }, () => this.props.getAllAdmin(this.state.filter, 'admin'))
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };


    onAddAccount = () => {
        this.setState({ addAccountState: true });
    };
    onEditAccount(account) {
        this.setState({ addAccountState: true, current_account: account, edit: true });
    };
    onAccountClose = () => {
        this.setState({ addAccountState: false, current_account: null, isSubmiting: false, edit: false });
    };

    onSaveAccount = async (data, id) => {
        await this.setState({
            ...this.state,
            isSubmiting: true
        })
        if (this.state.edit) {
            var dataSubmit = { ...data, id: id }
            await this.props.updateAccount(dataSubmit).then(res => {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    addAccountState: false,
                    current_account: null,
                    edit: false
                })
            }).catch(err => {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    // addAccountState: false
                })
            });
        }
        else await this.props.createAdmin(data).then(res => {
            this.setState({
                ...this.state,
                isSubmiting: false,
                addAccountState: false,
                current_account: null,
                edit: false
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                isSubmiting: false,
                // addAccountState: false
            })
        });
    };

    onDelete() {
        this.props.deleteAccount({ id: this.state.selectedRowKeys }).then(res => {
            this.setState({
                ...this.state,
                selectedRowKeys: []
            })
        })
    }

    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangTable = (pagination, filters, sorter, extra = { currentDataSource: [] }) => {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                sort: {
                    type: this.getOrder(sorter.order),
                    attr: sorter.columnKey
                },
                paging: {
                    perpage: pagination.pageSize,
                    page: pagination.current
                }
            }
        }, () => this.props.getAllAdmin(this.state.filter, 'admin'))

    }


    render() {
        const columns = [
            {
                key: 'image',
                title: <IntlMessages id="global.avatar" />,
                dataIndex: 'image',
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                render: (text, record) => (
                    <StatusButton data_id={record.id} status={record.status} table='customer' />
                )
            },
            {
                title: <IntlMessages id='global.username' />,
                dataIndex: 'username',
            },
            {
                title: <IntlMessages id='global.email' />,
                dataIndex: 'email',
                key: 'email',
                sorter: true
            },
            {
                title: <IntlMessages id='global.mobile' />,
                dataIndex: 'mobile',
                key: 'mobile',
                sorter: true
            },
            {
                title: <IntlMessages id='global.firstname' />,
                dataIndex: 'firstname',
                key: 'firstname',
            },
            {
                title: <IntlMessages id='global.lastname' />,
                dataIndex: 'lastname',
                key: 'lastname',
            },
            {
                title: <IntlMessages id="global.company" />,
                dataIndex: 'company',
                key: 'company'
            },
            {
                title: <IntlMessages id='global.id' />,
                dataIndex: 'id',
                key: 'id'
            }
        ];

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        var data = [];
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.passenger" />}
                        match={this.props.match}
                    />
                    <div className="row">

                        <RctCollapsibleCard colClasses='col-12'>
                            <TableActionBar
                                onAdd={() => { }}
                                onDelete={() => this.onDelete()}
                                onRefresh={() => this.onRefresh()}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                table='customer'
                                isShowPublishButtons={true}
                                onFilter={this.filter}
                            >
                                <span style={{ marginLeft: 8 }}>
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : ''}
                                </span>
                            </TableActionBar>

                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={data}
                                rowKey="id"
                                pagination={{
                                    pageSizeOptions: ['10', '20', '30'],
                                    total: 0,
                                    showSizeChanger: true,
                                }}
                                size="small"
                                onChange={this.onChangTable}
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        listAdmin: state.account.listAccount,
        paging: state.account.paging
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllAdmin: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
        createAdmin: (account) => dispatch(createACCOUNT(account)),
        updateAccount: (account) => dispatch(updateACCOUNT(account)),
        deleteAccount: (account) => dispatch(batchDelete(account))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListAdmin));