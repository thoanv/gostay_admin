import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import ImageInTable from "../../../components/ImageInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";

import { _getAllPropertyType,_update,_create,_delete } from "../../../actions/PropertyTypeAction";
import AddProperty_Type from "./AddProperty_Type";

class Property_Type extends Component {
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
            loading: false,
            open: false,
            item: null,
        };
        this.columns = [
            {
                title: <IntlMessages id="global.status" />,
                dataIndex: "status",
                render: (text, record) => (
                  <StatusButton
                    data_id={record.id}
                    status={record.status}
                    table="propertyType"
                  />
                )
              },
            {
                title: <IntlMessages id="global.title" />,
                key: "title",
                sorter: true,
                dataIndex: "title",
                render: (text, record) => {
                    return (
                        <b
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => this.onEdit(record)}
                        >
                            {record.title}
                        </b>
                    );
                },
            },

          
     
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
            },
        ];
    }

    componentDidMount() {
        this.props._getAll(this.state.filter);
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

    onChangeSearch(event) {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    search: event.target.value,
                },
            },
            () => this.props._getAll(this.state.filter)
        );
    }

    onRefresh() {
        this.props._getAll(this.state.filter);
        this.setState({
            selectedRowKeys: [],
        });
    }

    onDelete() {
        this.props._delete({ id: this.state.selectedRowKeys }).then(() => {
            this.setState({
                selectedRowKeys: [],
            });
        });
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
                    filter: {
                        ...this.state.filter,
                        search: value,
                    },
                },
                () => this.props._getAll(this.state.filter)
            );
        } else
            this.setState(
                {
                    ...this.state,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                },
                () => this.props._getAll(this.state.filter)
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
            () => {
                this.props._getAll(this.state.filter);
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
                    filter: {
                        ...this.state.filter,
                        paging: {
                            ...this.state.filter.paging,
                            page: page,
                            perpage: pageSize,
                        },
                    },
                },
                () => {
                    this.props._getAll(this.state.filter);
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
        await this.setState({
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
                        title={<IntlMessages id="sidebar.property_type" />}
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
                                table="property_type"
                                onFilter={this.filter}
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Table
                                tableLayout="auto"
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={list}
                                onChange={this.onChangTable}
                                rowKey="id"
                                size="small"
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["1","5","10", "20", "30"],
                                    total: paging.count,
                                 
                                }}
                             
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddProperty_Type
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
      
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.property_type.list,
        paging: state.property_type.paging,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAll: (filter) => dispatch(_getAllPropertyType(filter)),
        _update: (id) => dispatch(_update(id)),
        _create: (data) => dispatch(_create(data)),
        _delete: (data) => dispatch(_delete(data)),
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Property_Type)
);
