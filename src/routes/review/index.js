import React, { Component } from 'react';
import { connect } from "react-redux";
import { Table, Tag, Icon, Progress, Tooltip, Avatar, Button, Modal } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import IntlMessages from "Util/IntlMessages";
import StarRatingComponent from 'react-star-rating-component';
import { Link, withRouter } from "react-router-dom";
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ImageInTable from "../../components/ImageInTable";
import StatusButton from "../../components/StatusButton";
import TableActionBar from "../../components/TableActionBar";
import ReadMoreText from '../../components/ReadMoreText';
import moment from "moment";
// actions
import { getAllReview, batchDelete } from "../../actions/ReviewAction";

class Review extends Component {
    state = {
        filter: {
            sort: {
                type: "desc",
                attr: "id",
            },
            paging: {
                perpage: 10,
                page: 1,
            },
            search: "",
        },
        selectedRowKeys: [],
        isLoading: true
    }

    async componentDidMount() {
        await this.props.getAllReview(this.state.filter);
        this.setState({ isLoading: false })
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
                    await this.props.getAllReview(this.state.filter);
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
                    await this.props.getAllReview(this.state.filter);
                    this.setState({ isLoading: false })
                }
            );
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    async onRefresh() {
        this.setState({ isLoading: true });
        await this.props.getAllReview(this.state.filter);
        this.setState({ selectedRowKeys: [], isLoading: false });
    }

    async onDelete() {
        this.setState({ isLoading: true });
        await this.props.deleteReviews({ id: this.state.selectedRowKeys });
        await this.onRefresh();
        this.setState({ selectedRowKeys: [], isLoading: false });
    }

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
                await this.props.getAllReview(this.state.filter);
                this.setState({ isLoading: false })
            }
        );
    };

    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    render() {
        var { reviews, paging, config } = this.props;
        var { selectedRowKeys, isLoading } = this.state;

        var hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        console.log(reviews)

        var columns = [
            {
                title: 'Người đánh giá',
                dataIndex: 'created_by',
                key: 'created_by',
                render: (text, record) => {
                    return (
                        <div className="d-flex align-items-center">
                            <Avatar size={50} src={record.user_avatar ? config.url_asset_root + record.user_avatar : require('../../assets/img/user.png')} />
                            <h5 className="ml-2 mb-0">{record.user_firstname} {record.user_lastname}</h5>
                        </div>
                    )
                }
            },
            {
                title: 'Bình luận',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    return (
                        <div>
                            <h4>{record.title}</h4>
                            {/* <div>{record.comment}</div> */}
                            <ReadMoreText text={record.comment} />
                        </div>
                    )
                }
            },
            {
                title: 'Hạng đánh giá',
                dataIndex: 'rank',
                key: 'rank',
                sorter: true,
                render: (text, record) => {
                    return (
                        <StarRatingComponent
                            value={text}
                            renderStarIcon={() => <i className="fas fa-star"></i>}
                            editing={false}
                            emptyStarColor={'#bdc3c7'}
                        />
                    )
                }
            },
            {
                title: 'Đối tượng',
                dataIndex: 'sub_id',
                key: 'sub_id',
                width: '25%',
                render: (text, record) => {
                    if (record.object) {
                        if (record.type == 'STAY') {
                            return (
                                <div className="d-flex align-items-center">
                                    <Avatar size={50} src={record.object.cover_img ? config.url_asset_root + record.object.cover_img[0] : require('../../assets/img/stay.png')} />
                                    <div className="ml-2 w-70">
                                        <h5>{record.object.title}</h5>
                                        <div>{record.object.street}</div>
                                    </div>

                                </div>
                            )
                        } else {
                            return (
                                <div className="d-flex align-items-center">
                                    <Avatar style={{ objectFit: 'cover' }} size={50} src={record.object.vehicle ? config.url_asset_root + record.object.vehicle.image[0] : require('../../assets/img/car.png')} />
                                    <div className="ml-2 w-70">
                                        <h5>{record.object.title}</h5>
                                        <div>{record.object.vehicle.title}</div>
                                    </div>
                                </div>
                            )
                        }
                    }
                    return null;
                }
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (text, record) => (
                    <div>
                        <div>{moment(text).format('HH:mm')}</div>
                        <div>{moment(text).format('DD/MM/YYYY')}</div>
                    </div>
                )
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    if (text == 0) return <Tag color="red"><IntlMessages id="review.rejected" /></Tag>;
                    if (text == 1) return <Tag color="green"><IntlMessages id="review.approved" /></Tag>;
                    if (text == 2) return <Tag color="orange"><IntlMessages id="review.pending" /></Tag>;
                }
            }
        ]

        return (
            <div>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.review" />}
                    match={this.props.match}
                />
                <RctCollapsibleCard>
                    <TableActionBar
                        isShowAddButton={false}
                        onAdd={() => this.onCreate()}
                        onDelete={() => this.onDelete()}
                        onRefresh={() => this.onRefresh()}
                        isDisabled={!hasSelected}
                        rows={selectedRowKeys}
                        table="review"
                        onFilter={this.filter}
                        data={[
                            {
                                name: "status",
                                data: [{ id: 0, title: <IntlMessages id="review.rejected" /> }, { id: 1, title: <IntlMessages id="review.approved" /> }, { id: 2, title: <IntlMessages id="review.pending" /> }],
                                placeholder: <IntlMessages id="global.select_status" />,
                            },
                            {
                                name: "rank",
                                data: [{ id: 1, title: <IntlMessages id="review.1_star" /> }, { id: 2, title: <IntlMessages id="review.2_star" /> }, { id: 3, title: <IntlMessages id="review.3_star" /> }, { id: 4, title: <IntlMessages id="review.4_star" /> }, { id: 5, title: <IntlMessages id="review.5_star" /> }],
                                placeholder: <IntlMessages id="review.select_star" />,
                            },

                        ]}
                        justify="end"
                    >
                        {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                    </TableActionBar>
                    <Table
                        tableLayout="fixed"
                        rowSelection={rowSelection}
                        columns={columns}
                        loading={isLoading}
                        dataSource={reviews}
                        onChange={this.onChangTable}
                        rowKey="id"
                        size="small"
                        pagination={{
                            showSizeChanger: true,
                            pageSizeOptions: ["1", "5", "10", "20", "30"],
                            total: paging.count,
                        }}
                    />
                </RctCollapsibleCard>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        reviews: state.review.listReview,
        paging: state.review.paging,
        config: state.config
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllReview: (filter) => dispatch(getAllReview(filter)),
        deleteReviews: (data) => dispatch(batchDelete(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
