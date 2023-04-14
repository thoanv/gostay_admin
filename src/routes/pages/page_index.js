import { Table, Button, Tag } from "antd";
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import { getAllAccountWithoutPaging } from "../../actions/AccountAction";
import { getAllCategory } from "../../actions/CategoryActions";
import { addPages, deletePages, getAllPages, updatePages } from "../../actions/PagesAction";
import StatusButton from "../../components/StatusButton";
import TableActionBar from '../../components/TableActionBar';
import AddPages from "./AddPages";
import { Link } from 'react-router-dom';

const arrcolor = ["red", "green", "blue", "geekblue", "cyan", "#2db7f5", "purple"]

class ListPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                search: "",
                paging: {
                    perpage: 10,
                    page: 1
                }
            },
            addPagesState: false,
            selectedRowKeys: [],
            isSubmiting: false,
            current_pages: null,
            edit: false,


        }

    }
    componentDidMount() {
        this.props.getAllPages(this.state.filter);
        this.props.getAllSuplier(this.state.filter, 'admin');
        this.props.getAllCategory();

    }
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };


    onAddPages = () => {
        this.setState({
            addPagesState: true
        })
    }
    onEditPages(pages) {
        this.setState({
            addPagesState: true,
            current_pages: pages,
            edit: true
        })
    }
    onPagesClose = () => {
        this.setState({
            addPagesState: false,
            current_pages: null,
            isSubmiting: false,
            edit: false
        })
    }
    onChangeSearch(event) {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                search: event.target.value
            }
        }, () => this.props.getAllPages(this.state.filter))
    }
    onRefresh() {
        this.props.getAllPages(this.state.filter);
        this.setState({
            selectedRowKeys: []
        })
    }
    onDelete() {
        this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
            this.setState({
                selectedRowKeys: []
            })
        })
    }
    onChangPage(page, pageSize) {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                paging: {
                    perpage: pageSize,
                    page: page
                }
            }
        }, () => {
            this.props.getAllPages(this.state.filter);
        });
    }
    onChangePerpage(current, size) {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                paging: {
                    perpage: size,
                    page: current
                }

            }
        }, () => {
            this.props.getAllPages(this.state.filter);
        });
    }
    onSavePages = async (data, id) => {
        await this.setState({
            ...this.state,
            isSubmiting: true
        })
        if (this.state.edit) {
            var dataSubmit = { ...data, id: id }
            await this.props.updatePages(dataSubmit).then(res => {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    addPagesState: false,
                    current_pages: null,
                    edit: false
                })
            }).catch(err => {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })
            })
        }
        else await this.props.createPages(data).then(res => {
            this.setState({
                ...this.state,
                isSubmiting: false,
                addPagesState: false,
                current_pages: null,
                edit: false
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                isSubmiting: false
            })
        })
    }
    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangeTable = (pagination, filters, sorter, extra = { currentDataSource: [] }) => {

        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                paging: {
                    page: pagination.current,
                    perpage: pagination.pageSize
                },
                sort: {
                    type: this.getOrder(sorter.order),
                    attr: sorter.columnKey
                }
            }
        }, () => this.props.getAllPages(this.state.filter))

    }

    filter = (value, name, type) => {
        if (type === "search") {
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    search: value
                }
            }, () => this.props.getAllPages(this.state.filter))

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
            }, () => this.props.getAllPages(this.state.filter))
    }
    render() {


        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: <IntlMessages id='global.title' />,
                dataIndex: 'title',
                key: 'title',
                sorter: true,
                render: (text, record) => (
                    <span style={{ cursor: "pointer", color: "#1890ff" }}
                        onClick={() => this.onEditPages(record)}>{record.title}
                    </span>
                )
            },
            {
                title: <IntlMessages id='global.alias' />,
                dataIndex: 'alias',
                key: 'alias',
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text, record) => (
                    <StatusButton data_id={record.id} status={record.status} table='content' />
                )
            },
            {
                title: <IntlMessages id="global.category" />,
                dataIndex: 'categories',
                key: 'categories',
                render: (text, record) => (
                    <span>
                        {record.categories.map((item, index) => (
                            <Link to='/app/masters/category' key={index}>
                                <Tag key={index}>{item.title}</Tag>
                            </Link>
                        ))}
                    </span>
                )
            },
            {
                title: <IntlMessages id="global.created" />,
                dataIndex: 'created_at',
                key: 'created_at',
                className: 'center-column',
                render: (text, record) => (
                    <React.Fragment>
                        <div>
                            {moment(record.created_at).format('DD/MM/YYYY')}
                        </div>
                        <div>
                            {moment(record.created_at).format('HH:mm')}
                        </div>
                    </React.Fragment>
                ),
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: 'id',
                key: 'id',
                sorter: true
            },
        ];
        const { listPages, paging, categories } = this.props;
        var listAccountName = this.props.listSuplier.map(item => {
            return {
                id: item.id,
                title: item.firstname + " " + item.lastname
            };
        });

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.pages" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses='col-12'>
                            <TableActionBar
                                onAdd={() => this.onAddPages()}
                                onDelete={() => this.onDelete()}
                                onRefresh={() => this.onRefresh()}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                isShowPublishButtons={true}
                                table='content'
                                showFilter={false}
                                onFilter={this.filter}
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={listPages}
                                tableLayout="auto"
                                rowKey="id"
                                pagination={{
                                    size: "small",
                                    pageSizeOptions: ['1', '5', '10', '20', '50'],
                                    total: paging.count,
                                    showSizeChanger: true

                                }}
                                onChange={this.onChangeTable}
                            />

                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddPages
                    open={this.state.addPagesState}
                    onSavePages={this.onSavePages}
                    onPagesClose={this.onPagesClose}
                    loading={this.state.isSubmiting}
                    edit={this.state.edit}
                    pages={this.state.current_pages}
                    accountName={listAccountName}
                    categories={categories}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        listPages: state.pages.listPages,
        paging: state.pages.paging,
        listSuplier: state.account.listAccountPaging,
        categories: state.category.listCategory,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllPages: (filter) => dispatch(getAllPages(filter)),
        delete: (data) => dispatch(deletePages(data)),
        createPages: (data) => dispatch(addPages(data)),
        updatePages: (data) => dispatch(updatePages(data)),
        getAllSuplier: (filter, type) => dispatch(getAllAccountWithoutPaging(filter, type)),
        getAllCategory: filter => dispatch(getAllCategory(filter)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListPages));
