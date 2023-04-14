import { Table, Tag, Icon, Button, Divider, Col, message } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import ImageInTable from "../../../components/ImageInTable";
import TableActionBar from "../../../components/TableActionBar";
import { _createRoute, _deleteRoute, _getAll, _getAllRoute, _updateRoute, _getRouteDetail, _exportRoutes } from "../../../actions/CarAction";
import { getAllDestination, searchDestination } from "../../../actions/DestinationActions";
import AddRoute from "./AddRoute"
import { getAllACCOUNT } from "../../../actions/AccountAction";
import NumberFormat from "react-number-format";
import { SearchSupplier } from "../../statistics/SearchSupplier";
import FilterBar from "../../../components/FilterBar";
import ModalApproved from "../../../components/ModalApproved";

class Route extends Component {
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
                cid: {
                    type: "=",
                    value: ""
                }
            },
            edit: false,
            isSubmiting: false,
            selectedRowKeys: [], // Check here to configure the default column
            loading: true,
            open: false,
            item: null,
            listAirport: [],
            openModal: false,
            loadingExport: false
        };
        this.columns = [
            {
                title: <IntlMessages id="global.airport" />,
                dataIndex: "airport_name",
                key: "airport_name",
                fixed: 'left',
                width: 200,
                align: 'center',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {
                            rowSpan: row.rowSpanAirport
                        },
                    };
                    return obj;
                }
            },
            {
                title: <IntlMessages id="global.city" />,
                dataIndex: "city_name",
                key: "city_name",
                width: 150,
                align: 'center',
                fixed: 'left',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {
                            rowSpan: row.rowSpanCity
                        },
                    };
                    return obj;
                }
            },
            {
                title: <IntlMessages id="global.district" />,
                dataIndex: "district_name",
                key: "district_name",
                width: 150,
                fixed: 'left',
                align: 'center',
            },
            {
                title: <IntlMessages id="global.company" />,
                dataIndex: "company_name",
                key: "company_name",
                width: 150,
                align: 'center',
            },
            {
                title: <IntlMessages id="global.title" />,
                key: "title",
                dataIndex: "title",
                width: 250,
                align: 'center',
            },
            {
                title: <IntlMessages id="sidebar.vehicle" />,
                dataIndex: "vehicle",
                key: "vehicle",
                width: 250,
                align: 'center',
                render: (text) => {
                    return (
                        <div style={{ fontWeight: "400" }}>
                            <ImageInTable
                                src={text.image && text.image.length ? this.props.config.url_asset_root + text.image[0] : ""}
                                alt="image"
                            ></ImageInTable>
                            <p style={{ marginTop: "3px", marginBottom: "3px" }}>{text.title}</p>
                            <p style={{ alignItems: "center", marginBottom: "0px" }}>
                                <span style={{ fontSize: "14px", marginRight: "10px" }}><Icon type="user" /> {text.seat}</span>
                                <span style={{ fontSize: "14px" }}><Icon type="shop" /> {text.luggage}</span>
                            </p>
                        </div>
                    );
                },
            },
            {
                title: <IntlMessages id="route.duration" />,
                dataIndex: "duration",
                key: "duration",
                width: 150,
                align: 'center',
                render: text => (
                    <span >{text} <IntlMessages id="global.min" /></span>
                )
            },
            {
                title: <IntlMessages id="route.free_waiting_time" />,
                dataIndex: "free_waiting_time",
                key: "free_waiting_time",
                width: 150,
                align: 'left',
                render: (text, record) => (<div>
                    {text ? <p style={{ marginBottom: "5px" }} ><IntlMessages id="listroute.free_waiting_time" />: {text} <IntlMessages id="global.min" /></p> : null}
                    {record.free_waiting_time_i ? <p style={{ marginBottom: "5px" }} ><IntlMessages id="listroute.free_waiting_time_i" />: {record.free_waiting_time_i} <IntlMessages id="global.min" /></p> : null}
                    {record.free_waiting_time_return ? <p style={{ marginBottom: "5px" }} ><IntlMessages id="listroute.free_waiting_time_return" />: {record.free_waiting_time_return} <IntlMessages id="global.min" /></p> : null}
                    {record.waiting_fee ? <p style={{ marginBottom: "5px" }} ><IntlMessages id="global.waiting_fee" />: <NumberFormat value={+record.waiting_fee} thousandSeparator={true} displayType="text" suffix=" đ" /></p> : null}
                </div>)
            },
            {
                title: <IntlMessages id="route.cancel_hour_policy" />,
                dataIndex: "cancel_hour_policy",
                key: "cancel_hour_policy",
                width: 150,
                align: 'center',
                render: (text) => (<span >{text} <IntlMessages id="global.hour" /></span>)
            },
            {
                title: <IntlMessages id="global.price_onward" />,
                dataIndex: "price_onward",
                key: "price_onward",
                align: 'center',
                width: 150,
                render: (text) => (text ? <NumberFormat value={+text} thousandSeparator={true} displayType="text" suffix=" đ" /> : "")
            },
            // {
            //     title: <IntlMessages id="global.price_discount_onward" />,
            //     dataIndex: "price_discount_onward",
            //     key: "price_discount_onward",
            //     align: 'center',
            //     width: 150,
            // },
            {
                title: <IntlMessages id="global.price_return" />,
                dataIndex: "price_return",
                key: "price_return",
                align: 'center',
                width: 150,
                render: (text) => (text ? <NumberFormat value={+text} thousandSeparator={true} displayType="text" suffix=" đ" /> : "")

            },
            // {
            //     title: <IntlMessages id="global.price_discount_return" />,
            //     dataIndex: "price_discount_return",
            //     key: "price_discount_return",
            //     align: 'center',
            //     width: 150,
            // },
            // {
            //     title: <IntlMessages id="global.price_round" />,
            //     dataIndex: "price_round",
            //     key: "price_round",
            //     align: 'center',
            //     width: 150,
            // },
            // {
            //     title: <IntlMessages id="global.price_discount_round" />,
            //     dataIndex: "price_discount_round",
            //     key: "price_discount_round",
            //     align: 'center',
            //     width: 150,
            // },
            {
                title: <IntlMessages id="global.status" />,
                key: "status",
                align: 'center',
                width: 100,
                render: record => {
                    return (
                        <React.Fragment>
                            {record ? (
                                record.status === 0 ? (
                                    <Tag color="red">
                                        <IntlMessages id="global.unpublished" />
                                    </Tag>
                                ) :
                                    record.status === 1 ?
                                        (
                                            <Tag color="green">
                                                <IntlMessages id="global.published" />
                                            </Tag>
                                        )
                                        :
                                        (
                                            <Tag color="gold">
                                                <IntlMessages id="global.trashed" />
                                            </Tag>
                                        )
                            ) : null
                            }
                        </React.Fragment>
                    );
                }
            },
            {
                title: <IntlMessages id="global.approved" />,
                key: "approved",
                align: 'center',
                width: 100,
                render: record => {
                    return (
                        <React.Fragment>
                            {record ? (
                                record.approved === 1 ? (
                                    <div>
                                        <Icon type="check-circle" theme="outlined"
                                            style={{ fontSize: '16px', color: '#52c41a' }}
                                        />

                                    </div>
                                ) : (
                                        <div>

                                            <Icon type="close-circle" theme="outlined"
                                                style={{ fontSize: '16px', color: '#eb2f96' }}

                                            />
                                        </div>
                                    )
                            ) : null}
                        </React.Fragment>
                    );
                }
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                align: 'center',
                width: 100,
            },
            {
                title: <IntlMessages id="global.action" />,
                dataIndex: "created_at",
                width: 100,
                fixed: 'right',
                align: 'center',
                render: (text, record) => (
                    <span>
                        <Tag color="green" onClick={() => {
                            window.open(`/app/transport/route/${record.id}`, '_blank').focus();
                            // this.props.history.push(`/app/transport/route/${record.id}`)
                        }} style={{ margin: "2px" }}><IntlMessages id="global.detail" /></Tag>
                        <Tag color="blue" onClick={() => {
                            this.setState({ ...this.state, openModal: true, item: record })
                        }} style={{ margin: "2px" }}>Duyệt</Tag>
                    </span>

                )
            },
        ];
    }

    async componentDidMount() {
        try {
            await this.props._getAll(this.state.filter);
            let airport = await searchDestination({
                type: {
                    type: "=",
                    value: "airport",
                },
                paging: 0
            });
            this.setState({
                ...this.state,
                loading: false,
                listAirport: airport.list
            })
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }
        this.props.getAllAccount({}, "supplier");
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
            loading: true
        }, async () => {
            try {
                await this.props._delete({ id: this.state.selectedRowKeys });
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
        // this.setState({
        //     open: true,
        //     item: null,
        // });
        this.props.history.push('/app/transport/addroute')
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

    onSave = (data, id) => {
        this.setState({
            ...this.state,
            isSubmiting: true,
        }, async () => {
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
        });
    };


    setData = (list) => {
        let data = [];
        if (list && list.length) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                item.rowSpanAirport = 1;
                item.rowSpanCity = 1;
                if (i > 0 && item.airport == list[i - 1].airport) {
                    item.rowSpanAirport = 0;
                    if (item.city == list[i - 1].city) {
                        item.rowSpanCity = 0;
                    }
                    else {
                        for (let j = i + 1; j < list.length; j++) {
                            if ((list[j] && item.city == list[j].city) && (item.airport == list[j].airport)) {
                                item.rowSpanCity = item.rowSpanCity + 1;
                            }
                        }
                    }
                }
                else {
                    item.rowSpanAirport = 1;
                    item.rowSpanCity = 1;
                    for (let j = i + 1; j < list.length; j++) {
                        if ((list[j] && item.airport == list[j].airport) && (item.airport == list[j].airport)) {
                            item.rowSpanAirport = item.rowSpanAirport + 1;
                            if (item.city == list[j].city) {
                                item.rowSpanCity = item.rowSpanCity + 1;
                            }
                        }
                    }
                }
                data.push(item);
            }
        }
        return data;
    }

    exportExcel = () => {
        this.setState({
            loadingExport: true
        })
        _exportRoutes(this.state.filter).then(res => {
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
        const { loading, selectedRowKeys, listAirport, loadingExport } = this.state;
        const { list, paging } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        var data = this.setData(list);
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.route" />}
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
                                table="route"
                                onFilter={this.filter}
                                textSearch={false}
                            >
                                <Divider type="vertical" />
                                <Button type="primary" loading={loadingExport} onClick={this.exportExcel}>Xuất file Excel</Button>
                                <Divider type="vertical" />
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <FilterBar
                                textSearchPlaceholder="Tìm kiếm..."
                                onFilter={this.filter}
                                data={[
                                    {
                                        name: "status",
                                        data: [{ id: 0, title: <IntlMessages id="global.unpublished" /> }, { id: 1, title: <IntlMessages id="global.published" /> }, { id: 2, title: <IntlMessages id="global.trashed" /> }],
                                        placeholder: <IntlMessages id="global.select_status" />,
                                    },
                                    {
                                        name: "airport",
                                        data: listAirport,
                                        placeholder: "Chọn sân bay",
                                    }

                                ]}
                            >
                                <Col span={6}>
                                    <SearchSupplier
                                        supplier_id={this.state.filter.cid.value}
                                        onChange={(v) => this.filter(v, 'cid')}
                                    />
                                </Col>
                            </FilterBar>

                            <Table
                                bordered
                                loading={loading}
                                // tableLayout="auto"
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={data}
                                onChange={this.onChangTable}
                                rowKey="id"
                                size="small"
                                scroll={{ x: 1500 }}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "15", "25", "40"],
                                    total: paging.count,
                                    current: this.state.filter.paging.page,
                                    pageSize: this.state.filter.paging.perpage
                                }}

                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddRoute
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
                    loading={this.state.isSubmiting}
                />
                <ModalApproved
                    onClose={() => this.setState({ ...this.state, openModal: false, item: null })}
                    open={this.state.openModal}
                    record={this.state.item}
                    title={"Duyệt tuyến đường"}
                    onUpdate={this.props._update}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.route.list,
        paging: state.route.paging,
        listAirport: state.destination.listDestination,
        listCompany: state.account.listAccount,
        config: state.config
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAll: (filter) => dispatch(_getAllRoute(filter)),
        _update: (id) => dispatch(_updateRoute(id)),
        _create: (data) => dispatch(_createRoute(data)),
        _delete: (data) => dispatch(_deleteRoute(data)),
        getAllDestination: (filter) => dispatch(getAllDestination(filter)),
        getAllAccount: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
        _getRouteDetail: item => dispatch(_getRouteDetail(item)),
        _exportRoutes: (filter) => dispatch(_exportRoutes(filter))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Route)
);
