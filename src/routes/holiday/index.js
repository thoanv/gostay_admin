import React, { useState } from 'react';
import { Table, Button, Modal, Tag, Spin, Icon, Select, Descriptions } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getAllHolidays } from '../../actions/HolidayAction';
import { getAllACCOUNT } from '../../actions/AccountAction';
import { priceInVn } from '../../helpers/helpers';
import renderHTML from "react-render-html";

class Holiday extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        isLoading: false,
        filterAll: { paging: 0 },
        filter: {
            paging: {
                perpage: 10,
                page: 1,
            },
        },
        selectedItem: null
    }

    componentDidMount() {
        this.props.getAllCustomer(this.state.filterAll, "supplier");
        this.setState({
            isLoading: false
        })
        this.props.getAllHolidays(this.state.filter);

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
                    await this.props.getAllHolidays(this.state.filter);
                    this.setState({ isLoading: false })
                }
            );
        } else {
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
                    this.props.getAllHolidays(this.state.filter).then(() => {
                        this.setState({ isLoading: false })
                    });

                }
            );
        }
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
                await this.props.getAllHolidays(this.state.filter);
                this.setState({ isLoading: false })
            }
        );
    };

    render() {
        const { listCustomer, config, holidays, pagination } = this.props;
        var { selectedItem } = this.state;
        const customers = [];
        listCustomer.map(item => {
            let name = `${item.firstname || ''} ${item.lastname || ''}`;
            customers.push({
                id: item.id,
                title: `${name.length < 2 ? item.email || item.mobile : name}`
            })
        });

        console.log(this.state.filter)

        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "Ảnh",
                dataIndex: "cover_img",
                key: "cover_img",
                render: (text) => (
                    <img src={config.url_asset_root + text} className="holiday_cover_img" />
                )
            },
            {
                title: "Tiêu đề",
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <Button type="link" className="p-0" onClick={() => this.setState({ selectedItem: record })}>{text}</Button>
                )
            },
            {
                title: "Người đăng",
                width: "20%",
                render: (text, record) => (
                    <div>
                        <div><b>{record.sup_firstname} {record.sup_lastname}</b></div>
                        <div><small><Icon type="mail" /> {record.sup_email}</small></div>
                        <div><small><Icon type="phone" /> {record.sup_mobile}</small></div>
                    </div>
                )
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (text) => (
                    <div>{text ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>}</div>
                )
            },
            {
                title: "Yêu cầu trao đổi",
                dataIndex: "count",
                key: "count"
            },
            {
                title: "Có thể ở từ ngày",
                dataIndex: "start_date",
                key: "start_date",
                render: (text) => (
                    <div>{moment(text).format('DD/MM/YYYY')}</div>
                )
            },
            {
                title: "Đến ngày",
                dataIndex: "end_date",
                key: "end_date",
                render: (text) => (
                    <div>{moment(text).format('DD/MM/YYYY')}</div>
                )
            },
            {
                title: "Số đêm",
                dataIndex: "night",
                key: "night"
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
                            title="Kỳ nghỉ"
                            match={this.props.match}
                        />
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <TableActionBar
                                    onAdd={() => { this.onOpenModalForm() }}
                                    onDelete={() => { }}
                                    onRefresh={() => { }}
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
                                            name: "cid",
                                            data: customers,
                                            placeholder: <IntlMessages id="global.select_user" />,
                                        },
                                        {
                                            name: "status",
                                            data: [
                                                { id: 1, title: "Hiển thị" },
                                                { id: 0, title: "Ẩn" }
                                            ],
                                            placeholder: "Trạng thái"
                                        },
                                    ]}
                                    justify="end"
                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    columns={columns}
                                    dataSource={holidays}
                                    rowKey="id"
                                    size="small"
                                    pagination={pagination}
                                    tableLayout="auto"
                                    onChange={this.onChangTable}
                                // scroll={{ x: 1500 }}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </div>
                </Spin>
                {/* Holiday detail */}
                {
                    selectedItem ? (
                        <Modal
                            title="Chi tiết kỳ nghỉ"
                            visible={true}
                            onCancel={() => this.setState({ selectedItem: null })}
                            footer={null}
                        >
                            <Descriptions column={1}>
                                <Descriptions.Item label="Tiêu đề">{selectedItem.title}</Descriptions.Item>
                                <Descriptions.Item label="Người đăng">
                                    <div><b>{selectedItem.sup_firstname} {selectedItem.sup_lastname}</b> ({selectedItem.sup_email} | {selectedItem.sup_mobile})</div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">{selectedItem.status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>}</Descriptions.Item>
                                <Descriptions.Item label="Yêu cầu trao đổi">{selectedItem.count}</Descriptions.Item>
                                <Descriptions.Item label="Có thể ở từ ngày">{selectedItem.start_date}</Descriptions.Item>
                                <Descriptions.Item label="Đến ngày">{selectedItem.end_date}</Descriptions.Item>
                                <Descriptions.Item label="Số đêm">{selectedItem.night}</Descriptions.Item>
                                <Descriptions.Item label="Giá">{priceInVn(selectedItem.price)}</Descriptions.Item>
                                <Descriptions.Item label="Số khách tiêu chuẩn">{selectedItem.guests_standard}</Descriptions.Item>
                                <Descriptions.Item label="Số giường">{selectedItem.bedrooms}</Descriptions.Item>
                                <Descriptions.Item label="Căn hộ / Homestay">{selectedItem.property_title}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">{renderHTML(selectedItem.description)}</Descriptions.Item>
                            </Descriptions>
                        </Modal>
                    ) : null
                }
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        listCustomer: state.account.listAccount,
        holidays: state.holiday.holidays,
        paging: state.holiday.paging,
        config: state.config
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCustomer: (filter, type) => dispatch(getAllACCOUNT(filter, type)),
        getAllHolidays: (filter) => dispatch(getAllHolidays(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Holiday);