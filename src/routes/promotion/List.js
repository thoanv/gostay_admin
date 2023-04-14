import { Table, Button, Tag, Col, Divider, message } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Add from "./Add";
import { _getAll, _create, _update, _delete, _exportPromotion } from "../../actions/PromotionAction";
import { debounce } from "lodash"
import { SearchSupplier } from "../statistics/SearchSupplier";
import FilterBar from "../../components/FilterBar";


const dataFilter = [
    {
        name: 'type',
        col: 6,
        placeholder: 'Type of promotion',
        value: [''],
        data: [
            { title: "Percent", id: "1" },
            { title: "Number", id: "2" },
        ]
    },
    {
        name: 'style',
        col: 6,
        placeholder: 'Style of promotion',
        value: [''],
        data: [
            { title: "Normal", id: "1" },
            { title: "Additional of admin", id: "2" },
        ]
    },
]

class Promotion extends Component {
    constructor(props) {
        super(props);
        this.onChangeTable = debounce(this.onChangeTable, 300);
        this.filter = debounce(this.filter, 300);
        this.state = {
            loading: true,
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                search: "",
                paging: {
                    perpage: 15,
                    page: 1
                },
                cid: {
                    type: "=",
                    value: ""
                }
            },
            isOpenModal: false,
            selectedRowKeys: [],
            isSubmiting: false,
            current_record: null,
            edit: false,
            loadingExport: false
        };

        this.columns = [
            // {
            //     key: "updated_at",
            //     title: "STT",
            //     dataIndex: "updated_at",
            //     align: "left",
            //     render: (text, record, rest) => {
            //         let { filter } = this.state;
            //         let index = (filter.paging.page - 1) * filter.paging.perpage + rest + 1;
            //         return (
            //             <div style={{ cursor: "pointer", color: "blue" }} onClick={() => this.onEdit(record)}>{`${index}`}</div>
            //         );
            //     }

            // },
            {
                title: <IntlMessages id="global.title" />,
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <span style={{ color: "#038fde" }}>{text}</span>
                )
            },

            {
                title: "Nhà cung cấp",
                dataIndex: "company_name",
                key: "company_name",
            },

            {
                title: <IntlMessages id="promotion.amount" />,
                dataIndex: "amount",
                key: "amount",
                sorter: true,
                render: text => `${text}%`
            },
            // {
            //     title: <IntlMessages id="global.type" />,
            //     dataIndex: "type",
            //     key: "type",
            //     render: (text, record) => (text == 1 ? "Percent" : "Number")
            // },
            // {
            //     title: <IntlMessages id="promotion.style" />,
            //     dataIndex: "style",
            //     key: "style",
            //     render: (text, record) => (text == 1 ? "Nomal" : "Additional of admin")
            // },
            {
                title: <IntlMessages id="global.status" />,
                dataIndex: "status",
                key: "status",
                render: (text, record) => (
                    record ? (
                        record.status === 1 ? (
                            <Tag color="green">
                                <IntlMessages id="global.published" />
                            </Tag>
                        ) : (
                            <Tag color="red">
                                <IntlMessages id="global.unpublished" />
                            </Tag>
                        )
                    ) : null
                )
            },
            {
                title: <IntlMessages id="global.start_date" />,
                dataIndex: "start_date",
                key: "start_date",
                sorter: true,
                render: (text, record) => moment(text).format("DD/MM/YYYY, HH:mm:ss")
            },
            {
                title: <IntlMessages id="global.end_date" />,
                dataIndex: "end_date",
                key: "end_date",
                sorter: true,
                render: (text, record) => moment(text).format("DD/MM/YYYY, HH:mm:ss")
            },
            {
                title: <IntlMessages id="promotion.start_buy_date" />,
                dataIndex: "start_buy",
                key: "start_buy",
                sorter: true,
                render: (text, record) => moment(text).format("DD/MM/YYYY, HH:mm:ss")
            },
            {
                title: <IntlMessages id="promotion.end_buy_date" />,
                dataIndex: "end_buy",
                key: "end_buy",
                sorter: true,
                render: (text, record) => moment(text).format("DD/MM/YYYY, HH:mm:ss")
            },
            {
                title: <IntlMessages id="global.created" />,
                dataIndex: "created_at",
                key: "created_at",
                className: "center-column",
                render: (text, record) => moment(text).format("DD/MM/YYYY, HH:mm:ss"),
                sorter: true
            },
            // {
            //     title: <IntlMessages id="global.id" />,
            //     dataIndex: "id",
            //     key: "id",
            //     className: "center-column",
            //     render: (text, record) => (
            //         <Link to={`/app/promotion/${record.id}`} >{text}</Link>
            //     ),
            // },
        ];

    }


    async componentDidMount() {
        try {
            await this.props._getAll(this.state.filter);
            this.setState({
                ...this.state,
                loading: false
            });
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }

    }


    //paging start
    onChangePerpage(current, size) {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: size,
                        page: current
                    }
                }
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    }
    onChangePage(page, pageSize) {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: pageSize,
                        page: page
                    }
                },
                loading: true
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    }
    //paging end


    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };



    //add 
    onAdd = () => {
        this.setState({ isOpenModal: true });
    };
    onEdit(record) {
        this.setState({
            isOpenModal: true,
            current_record: record,
            edit: true
        });
    }
    onClose = () => {
        this.setState({
            isOpenModal: false,
            current_record: null,
            isSubmiting: false,
            edit: false
        });
    };
    onSave = (data, id) => {
        console.log(data)
        this.setState({
            ...this.state,
            isSubmiting: true
        });
        if (this.state.edit) {
            var dataSubmit = { ...data, id: id };
            this.props
                ._update(dataSubmit)
                .then(res => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        isOpenModal: false,
                        current_record: null,
                        edit: false
                    });
                })
                .catch(err => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false
                    });
                });
        } else {
            var { auth } = this.props;
            data.cid = auth.id;
            this.props
                ._create(data)
                .then(res => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        isOpenModal: false,
                        current_record: null,
                        edit: false
                    });
                })
                .catch(err => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false
                    });
                });
        }

    };
    //add  end


    onRefresh() {
        this.props._getAll(this.state.filter);
        this.setState({
            selectedRowKeys: []
        });
    }


    //sort, filter start
    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangeTable = (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
                loading: true,
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
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    };

    onDelete() {
        this.setState({
            ...this.state,
            isSubmiting: true
        }, async () => {
            try {
                await this.props._delete({ id: this.state.selectedRowKeys })
                this.setState({
                    ...this.state,
                    selectedRowKeys: [],
                    isSubmiting: false
                });
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                });
            }
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
                        search: value
                    }
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        });
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
                            value: value
                        }
                    }
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        });
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
    };
    //sort filter end

    exportExcel = () => {
        this.setState({
            loadingExport: true
        })
        _exportPromotion(this.state.filter).then(res => {
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

        const { selectedRowKeys, loading, isSubmiting, loadingExport } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const hasSelected = selectedRowKeys.length > 0;

        const { list, paging } = this.props;
        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.promotion" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <div className="mb-2">
                            <Button type="primary" loading={loadingExport} onClick={this.exportExcel}>Xuất file Excel</Button>
                            </div>
                            <FilterBar
                                textSearchPlaceholder="Tìm kiếm..."
                                onFilter={this.filter}
                            >
                                <Col span={6}>
                                    <SearchSupplier
                                        supplier_id={this.state.filter.cid.value}
                                        onChange={(v) => this.filter(v, 'cid')}
                                    />
                                </Col>
                            </FilterBar>

                            <Table
                                loading={loading}
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={list}
                                tableLayout="auto"
                                rowKey="id"
                                size="small"
                                pagination={{
                                    pageSizeOptions: ["15", "30", "50"],
                                    total: paging.count,
                                    showSizeChanger: true,
                                    current: this.state.filter.paging.page,
                                    pageSize: this.state.filter.paging.perpage
                                }}
                                onChange={this.onChangeTable}

                            />
                        </RctCollapsibleCard>
                    </div>
                </div>

                <Add
                    open={this.state.isOpenModal}
                    onSave={this.onSave}
                    onClose={this.onClose}
                    isSubmiting={this.state.isSubmiting}
                    edit={this.state.edit}
                    record={this.state.current_record}
                />
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        list: state.promotion.list,
        paging: state.promotion.paging,
        auth: state.authUser.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: (filter) => dispatch(_getAll(filter)),
        _create: data => dispatch(_create(data)),
        _update: data => dispatch(_update(data)),
        _delete: data => dispatch(_delete(data)),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Promotion)
);
