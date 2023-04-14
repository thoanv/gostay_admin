import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import TableActionBar from "../../../components/TableActionBar";
import moment from 'moment';
import { _create, _delete, _getAll, _update } from "../../../actions/RouteServiceAction";
import Add from "./Add";


class Car extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
                search: "",
            },
            edit: false,
            isSubmiting: false,
            selectedRowKeys: [], // Check here to configure the default column
            loading: true,
            open: false,
            item: null,
        };
        this.columns = [
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
            },
            {
                title: <IntlMessages id="global.title" />,
                key: "title",
                dataIndex: "title",
                render: (text, record) => <span style={{ color: "blue", cursor: "pointer" }} onClick={() => this.onEdit(record)}>{text}</span>
            },
            {
                title: <IntlMessages id="global.created_at" />,
                key: "created_at",
                dataIndex: "created_at",
                render: (text, record) => moment(text).format("DD/MM/YYYY HH:mm")
            },
            {
                title: <IntlMessages id="global.updated_at" />,
                key: "updated_at",
                dataIndex: "updated_at",
                render: (text, record) => moment(text).format("DD/MM/YYYY HH:mm")
            },
        ];
    }

    async componentDidMount() {
        try {
            await this.props._getAll(this.state.filter);
            this.setState({
                ...this.state,
                loading: false
            })
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }
    }

    onCancel() {
        this.setState({
            ...this.state,
            open: false,
        });
    }


    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };


    onRefresh() {
        this.props._getAll(this.state.filter);
        this.setState({
            selectedRowKeys: [],
        });
    }

    onDelete() {
        this.setState({
            ...this.state,
            loading: true,
        }, async () => {
            try {
                await this.props._delete({ id: this.state.selectedRowKeys })
                this.setState({
                    ...this.state,
                    selectedRowKeys: [],
                    loading: false
                });
            } catch (error) {
                this.setState({
                    ...this.state,
                    loading: false
                });
            }
        })

    }

    onCreate = () => {
        this.setState({
            open: true,
            item: null,
        });
    };

    onEdit = (item) => {
        this.setState({
            open: true,
            item: item,
            edit: true,
        });
    };

    onClose = () => {
        this.setState({
            open: false,
            item: null,
            edit: false,
            isSubmiting: false,
        });
    };

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
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
        } else
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
    };

    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
                loading: true,
                filter: {
                    ...this.state.filter,
                    sort: {
                        type: this.getOrder(sorter.order),
                        attr: sorter.columnKey,
                    },
                    paging: {
                        perpage: pagination.pageSize,
                        page: pagination.current,
                    },
                },
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    };

    handleChangePage(page, pageSize) {
        if (
            page != this.state.filter.paging.page ||
            (pageSize != this.state.filter.paging.perpage && pageSize)
        ) {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        paging: {
                            ...this.state.filter.paging,
                            page: page,
                            perpage: pageSize,
                        },
                    },
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
        }
    }

    setStateFalse() {
        this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            item: null,
            edit: false,
        });
    }

    onSave = async (data, id) => {
        this.setState({
            ...this.state,
            isSubmiting: true,
        });
        if (this.state.edit) {
            try {
                var dataSubmit = { ...data, id: id };
                await this.props._update(dataSubmit);
                this.setStateFalse();
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                });
            }
        } else {
            try {
                await this.props._create(data);
                this.setStateFalse();
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                });
            }
        }
    };

    render() {
        const { loading, selectedRowKeys } = this.state;



        const { list, paging } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.route_service" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <TableActionBar
                                onAdd={() => this.onCreate()}
                                onDelete={() => this.onDelete()}
                                onRefresh={() => this.onRefresh()}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                table="vehicle"
                                onFilter={this.filter}
                                isShowPublishButtons={false}
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Table
                                loading={loading}
                                tableLayout="auto"
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={list}
                                onChange={this.onChangTable}
                                rowKey="id"
                                size="small"
                                pagination={{
                                    pageSizeOptions: ["10", "15", "25", "40"],
                                    total: paging.count,
                                    showSizeChanger: true,
                                    current: this.state.filter.paging.page,
                                    pageSize: this.state.filter.paging.perpage
                                }}

                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <Add
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
                    loading={this.state.isSubmiting}
                    authUser={this.props.authUser}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.route_service.list,
        paging: state.route_service.paging,
        config: state.config,
        authUser: state.authUser.data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAll: (filter) => dispatch(_getAll(filter)),
        _update: (id) => dispatch(_update(id)),
        _create: (data) => dispatch(_create(data)),
        _delete: (data) => dispatch(_delete(data)),
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Car)
);