import { Table, Tag, message, Divider, Button } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import ImageInTable from "../../../components/ImageInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";

import { _create, _delete, _getAll, _update, _exportCars } from "../../../actions/CarAction";
import AddCar from "./AddCar";

import { CarType } from '../../../components/CarType';



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
            loadingExport: false
        };
        this.columns = [
            {
                title: <IntlMessages id="global.status" />,
                dataIndex: "status",
                key: "status",
                render: (text, record) => (
                    <React.Fragment>
                        {
                            record && record.status == 0 ? (
                                <Tag color="red">
                                    <IntlMessages id="global.unpublished" />
                                </Tag>
                            ) :
                                record && record.status == 1 ?
                                    (
                                        <Tag color="green">
                                            <IntlMessages id="global.published" />
                                        </Tag>
                                    )
                                    : ""
                        }
                    </React.Fragment>
                )
            },
            {
                title: <IntlMessages id="global.image" />,
                dataIndex: "image",
                key: "image",
                render: (text, record) => {
                    if (record.image.length) {
                        return (
                            <div style={{ width: 120 }}>
                                <ImageInTable
                                    src={record.image.length ? this.props.config.url_asset_root + record.image[0] : ""}
                                    alt="image"
                                    height={70}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        );
                    } else {
                        return null
                    }
                },
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
            // {
            //     title: <IntlMessages id="global.company" />,
            //     key: "company_name",
            //     dataIndex: "company_name",
            // },
            {
                title: <IntlMessages id="car.seat" />,
                key: "seat",
                sorter: true,
                dataIndex: "seat",
                align: 'center',
            },
            {
                title: <IntlMessages id="car.luggage" />,
                key: "luggage",
                sorter: true,
                dataIndex: "luggage",
                align: 'center',
            },
            {
                title: <IntlMessages id="vehicle.type" />,
                key: "type",
                dataIndex: "type",
                align: 'center',
                render: (text, record) => <b><CarType type={text} /></b>
            },
            {
                title: <IntlMessages id="car.year" />,
                key: "year",
                dataIndex: "year",
                align: 'center',
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
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

    exportExcel = () => {
        this.setState({
            loadingExport: true
        })
        _exportCars(this.state.filter).then(res => {
            message.success("Xuất file thành công")
            this.setState({
                loadingExport: false
            })
        }).catch(err => {
            message.error("Có lỗi xảy ra, vui lòng thử lại")
            this.setState({
                loadingExport: false
            })
        })
    }

    render() {
        const { loading, selectedRowKeys, loadingExport } = this.state;

        const dataFilter = [
            {
                name: 'type',
                col: 6,
                placeholder: <IntlMessages id="vehicle.type" />,
                value: [''],
                data: this.props.config && this.props.config.car_type ? this.props.config.car_type.map(item => { return { ...item, id: item.ma } }) : []
            }
        ]

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
                        title={<IntlMessages id="sidebar.vehicle" />}
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
                                showFilter={true}
                                data={dataFilter}
                                isShowPublishButtons={false}
                            >
                                <Divider type="vertical" />
                                <Button type="primary" loading={loadingExport} onClick={this.exportExcel}>Xuất file Excel</Button>
                                <Divider type="vertical" />
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
                <AddCar
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
                    loading={this.state.isSubmiting}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.car.list,
        paging: state.car.paging,
        config: state.config
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