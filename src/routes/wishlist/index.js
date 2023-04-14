import React, { useState } from 'react';
import { Table, Button, Modal, Tabs, Spin, DatePicker } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getAllWishlist, getDetailWishlist } from '../../actions/WishlistActions';
import AvatarInTable from '../../components/AvatarInTable';
import StatusButton from '../../components/StatusButton';
const confirm = Modal.confirm;

function ModelUsers(props) {
    let { isOpen, onCancel, data, urlAsset } = props
    const collumns = [
        {
            key: "image",
            title: <IntlMessages id="global.avatar" />,
            dataIndex: "image",
            render: (text, record) => {
                let avatar_src = record.image ? urlAsset + record.image : require('../../assets/img/user.png');
                return (
                    <AvatarInTable
                        src={avatar_src}
                        defaul={record.image === "//logo3.png" ? 1 : 0}
                        title={
                            record.firstname
                                ? `${record.firstname}${record.lastname}`
                                : `user`
                        }
                        alt={`${record.firstname} ${record.lastname}`}
                    ></AvatarInTable>
                )
            }
        },
        {
            title: <IntlMessages id="global.status" />,
            dataIndex: "status",
            render: (text, record) => (
                <StatusButton
                    data_id={record.id}
                    status={record.status}
                    table="customer"
                />
            )
        },
        {
            title: <IntlMessages id="global.email" />,
            dataIndex: "email",
            key: "email",
            sorter: true,
            render: (text, record) => (
                <b
                    style={{ color: "blue", cursor: "pointer" }}
                // onClick={() => this.onEditAccount(record)}
                >
                    {record.email}
                </b>
            )
        },
        {
            title: <IntlMessages id="global.mobile" />,
            dataIndex: "mobile",
            key: "mobile",
            sorter: true
        },
        {
            title: <IntlMessages id="global.firstname" />,
            dataIndex: "firstname",
            key: "firstname"
        },
        {
            title: <IntlMessages id="global.lastname" />,
            dataIndex: "lastname",
            key: "lastname"
        },
        {
            title: <IntlMessages id="global.id" />,
            dataIndex: "id",
            key: "id",
            sorter: true
        }
    ];
    return (
        <Modal
            title={<IntlMessages id="global.user" />}
            visible={isOpen}
            onOk={onCancel}
            onCancel={onCancel}
            width={'70%'}
        >
            <Table
                columns={collumns}
                dataSource={data}
                rowKey="value"
                size="small"
                tableLayout="auto"
                pagination={false}
            />
        </Modal>
    )
}

class Wishlist extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        openModalRecipents: false,
        cItem: null,
        openModalUsers: false,
        isLoading: false,
        openModalSchedule: false
    }

    onChangTable = (
        pagination,
        filters,
        sorter,
    ) => {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: pagination.pageSize,
                        page: pagination.current
                    }
                }
            },
            () => this.props.getAllWishlist(this.state.filter)
        );
    };

    filter = (value, name, type) => {
        if (type === "search") {
            this.setState(
                {
                    ...this.state,
                    filter: {
                        ...this.state.filter,
                        search: value
                    }
                },
                () => this.props.getAllWishlist(this.state.filter)
            );
        } else {
            this.setState(
                {
                    ...this.state,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value
                        }
                    }
                },
                () => this.props.getAllWishlist(this.state.filter)
            );
        }
    };

    onCloseModalUsers = () => {
        this.setState({
            openModalUsers: false,
            cItem: null
        })
    }

    onOpenModalUsers = (item) => {
        this.props.getDetailWishlist(item.id).then(data => {
            this.setState({
                cItem: this.props.wishlist.detailItem,
                openModalUsers: true,
            })
        })

    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    componentDidMount() {
        this.props.getAllWishlist();
    }

    render() {
        var { config } = this.props;

        const columns = [
            {
                title: <IntlMessages id="global.title" />,
                key: 'title',
                render: (text, record) => {
                    let { settings } = record;
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { this.onOpenModalPreview(record) }} >{record.object.title} </b>
                    )
                }
            },
            {
                title:<IntlMessages id="global.type" />,
                dataIndex: "type",
                key: "type"
            },
            {
                title: "Số lượt thích",
                className: "center-column",
                key:'count_user',
                render: (text, record) => (
                    <b style={{ color: "blue", cursor: "pointer" }}
                    >
                        {record.count}
                    </b>
                )
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "object.id",
                key: "object.id",
                className: "center-column",
                sorter: true
            },
            {
                title: <IntlMessages id="global.actions" />,
                key:'actions',
                className: "center-column",
                render: (text, record) => {
                    return (
                        <React.Fragment>
                            <Button
                                type="primary" className="mr-4" size="default" onClick={() => {
                                    this.onOpenModalUsers(record)
                                }}><IntlMessages id="global.detail" /></Button>
                        </React.Fragment>
                    )
                }
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
                <Spin tip="Processing..." spinning={this.state.isLoading}>
                    <div className="formelements-wrapper">
                        <PageTitleBar
                            title={<IntlMessages id="sidebar.wishlist" />}
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
                                    isShowAddButton={false}
                                    // onFilter={this.filter}
                                    textSearch={false}
                                    data={[
                                        {
                                            name: "type",
                                            data: [{ id: "STAY", title: "Stay" }, { id: "CAR", title: "Car" }],
                                            placeholder: "Select production type...",
                                        },
                                    ]}
                                >
                                    <span style={{ marginLeft: 8 }}>
                                        {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                    </span>
                                </TableActionBar>

                                <Table
                                    // rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.props.wishlist.list}
                                    rowKey="id"
                                    size="small"
                                    pagination={{
                                        pageSizeOptions: ["10", "20", "30"],
                                        total: this.props.wishlist.paging.count,
                                        showSizeChanger: true
                                    }}
                                    tableLayout="auto"
                                    onChange={this.onChangTable}
                                // scroll={{ x: 1500 }}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </div>
                </Spin>
                <ModelUsers isOpen={this.state.openModalUsers} onCancel={this.onCloseModalUsers} data={this.state.cItem} urlAsset={config.url_asset_root} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        wishlist: state.wishlist,
        config: state.config
    }
}

export default connect(mapStateToProps, { getAllWishlist, getDetailWishlist })(Wishlist);