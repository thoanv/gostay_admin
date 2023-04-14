import { DatePicker, Form, Table, Tag } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from "Components/TableActionBar";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
    getAllCampaigns,
    batchDelete
} from "../../../actions/GrowthHackingCampaignAction";
import Truncate from 'react-truncate';

class Campaign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
            },
            selectedRowKeys: [],
            open: false,
            openAssign: false,
            current_assign: null,
            tourFilter: {
                paging: 0,
            },
            destinationFilter: {
                paging: 0,
            },
            order_current: null,
        };
    }

    componentDidMount() {
        this.props.getAllCampaigns(this.state.filter);
    }

    onFilter(name, value, type = '=') {
        this.setState({
            filter: {
                ...this.state.filter,
                [name]: {
                    type: type,
                    value: value,
                },
            },
        });
        setTimeout(() => {
            this.props.getAllCampaigns(this.state.filter);
        }, 300);
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
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
        extra = { currentDataSource: [] }
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
                this.props.getAllCampaigns(this.state.filter);
            }
        );
    };
    setTitle(title) {
        if (title && title.length) {
            return (
                <Truncate lines={1}>{title}</Truncate>
            )
        }
        return "";
    }

    onDeleteItems() {
        this.props.batchDelete(this.state.selectedRowKeys);
    }

    render() {
        const { selectedRowKeys } = this.state;

        const { listCampaigns, paging } = this.props;

        console.log(selectedRowKeys);

        const columns = [
            {
                title: <IntlMessages id="global.title" />,
                key: "name",
                render: (text, record) => {
                    return <Link to={`/app/growth-hacking/campaigns/${record.id}`}>{text}</Link>;
                },
                dataIndex: "name",
            },
            {
                title: <IntlMessages id="global.type" />,
                key: "type",
                dataIndex: "type",
            },
            {
                title: <IntlMessages id="global.rule" />,
                key: "rule_name",
                dataIndex: "rule_name",
            },
            {
                title: <IntlMessages id="global.created" />,
                dataIndex: "created_at",
                key: "created_at",
                className: "center-column",
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                        <div>{moment(record.created_at).format("HH:mm")}</div>
                    </React.Fragment>
                ),
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
            },
        ];

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.campaign" />}
                        match={this.props.match}
                    />
                    <TableActionBar 
                        isShowPublishButtons={false}
                        onAdd={() => this.props.history.push('/app/growth-hacking/campaigns/form')}
                        onDelete={() => this.onDeleteItems()}
                        onFilter={(keyword) => this.onFilter('name', keyword, 'like')}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <Table
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: this.onSelectChange,
                                }}
                                columns={columns}
                                dataSource={listCampaigns}
                                onChange={this.onChangTable}
                                rowKey="id"
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    total: +paging.count,
                                    defaultCurrent: +paging.page,
                                    pageSize: +paging.perpage,
                                }}
                                size="small"

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
        listCampaigns: state.growthHackingCampaign.listCampaigns,
        paging: state.growthHackingCampaign.paging,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllCampaigns: (filter) => dispatch(getAllCampaigns(filter)),
        batchDelete: (ids) => dispatch(batchDelete(ids))
    };
};
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Campaign)
);
