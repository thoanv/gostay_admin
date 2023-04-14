import React from 'react';
import { Table, Button, Modal, Tabs, Icon, Input, Checkbox } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import {
    getListSegments, getListMembersSegment,
    getListSubscribers, updateMembersSegment,
    addSegment, deleteSegment
} from '../../actions/NewsletterAction';
import { NotificationManager } from "react-notifications";
import AvatarInTable from '../../components/AvatarInTable';
import { getAllAccountWithoutPaging } from '../../actions/AccountAction';
import StatusButton from '../../components/StatusButton';
import { Link } from 'react-router-dom';

const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const { TabPane } = Tabs

function RecipentModal(props) {

    let { data, isOpen, handleClick } = props;

    let columns = [
        {
            title: <IntlMessages id="global.email" />,
            dataIndex: "email_address",
            key: "email_address",
            // className: "center-column",
        },
        {
            title: <IntlMessages id="global.status" />,
            dataIndex: "status",
            key: "status",
            className: "center-column",
        },
        {
            title: <IntlMessages id="global.id" />,
            dataIndex: "id",
            key: "id",
            className: "center-column",
        },
    ];
    return (
        <Modal
            title={<IntlMessages id="newsletter.recipents" />}
            visible={isOpen}
            onOk={handleClick}
            onCancel={handleClick}
            width="70%"
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey="value"
                size="default"
                tableLayout="auto"
                pagination={{
                    pageSize: 10
                }}
            />
        </Modal>
    )
}

class Recipents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalUpdate: false,
            cItem: null,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            optionsSubscriber: [],
            selectedRowKeys: [],
            nameSegment: "",
            openModalRecipients: false,
            loading: true
        }
    }

    componentDidMount() {
        this.props.getListSubscribers();
        this.props.getListSegments().then(res => {
            this.setState({
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        });
    }

    openAlert(item) {
        confirm({
            title: "Bạn có muốn xóa bản ghi này không?",
            okText: 'Có',
            cancelText: 'Huỷ',
            okType: "danger",
            onOk: () => this.onDeleteSegment(item),
            onCancel() { }
        });
    }
    onSelectRowChange = selectedRowKeys => {
        this.setState({ selectedRowKeys: selectedRowKeys })
    };

    onChange = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < this.props.newsletter.subscribers.length,
            checkAll: checkedList.length === this.props.newsletter.subscribers.length,
        });

    };

    onCheckAllChange = e => {
        let subscribers = this.props.newsletter.subscribers.map(_ => ({
            key: _.id,
            email_address: _.email_address
        }))
        this.setState({
            checkedList: e.target.checked ? subscribers.email_address : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    onOpenModalUpdate = (cItem) => {
        this.props.getAllAccountWithoutPaging({}, 'registered');
        this.setState({
            openModalUpdate: true,
            cItem: cItem
        });
        if (cItem) {
            this.props.getListMembersSegment(cItem.id).then(data => {
                let checkedList = this.props.newsletter.membersSegment.map(_ => ({
                    key: _.id,
                    email_address: _.email_address
                }))
                this.setState({
                    checkedList: checkedList.email_address,
                    selectedRowKeys: checkedList
                })
            });
        }
    }

    onCloseModalUpdate = () => {
        this.setState({
            openModalUpdate: false,
            cItem: null,
            selectedRowKeys: []
        });
    }

    onOpenModalRecipient = (cItem) => {
        // this.setState({
        //     cItem: cItem
        // });
        if (cItem) {
            this.props.getListMembersSegment(cItem.id).then(data => {
                this.setState({
                    openModalRecipients: true
                })
            });
        }

    }

    onCloseModalRecipient = () => {
        this.setState({
            openModalRecipients: false,
            cItem: null
        });
    }

    onUpdate = () => {
        this.props.updateMembersSegment(this.state.cItem.id, this.state.cItem.name, this.state.selectedRowKeys).then(
            data => {
                NotificationManager.success('Update success');
                this.onCloseModalUpdate();
                this.props.getListSegments();
            }
        )
    }
    onAdd = () => {
        this.props.addSegment(this.state.nameSegment, this.state.selectedRowKeys).then(
            data => {
                NotificationManager.success('Add success');
                this.onCloseModalUpdate();
                this.props.getListSegments();
            }
        )
    }

    onDeleteSegment = (item) => {
        this.props.deleteSegment(item.id).then(
            data => {
                NotificationManager.success('Delete success');
                this.props.getListSegments();
            }
        )
    }

    onSearch(keyword) {
        this.props.getListSegments({
            name: {
                type: 'like',
                value: keyword
            }
        });
    }

    render() {
        var { config } = this.props;
        let { openModalUpdate, selectedRowKeys } = this.state
        // let subscribers = this.props.newsletter.subscribers.map(_ => _.email_address)
        let columns = [
            {
                title: <IntlMessages id="global.title" />,
                // dataIndex: "name",
                key: "title",
                // className: "center-column",
                render: (text, record) => {
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { this.onOpenModalRecipient(record) }} >{record.name} </b>
                    )
                }
            },
            {
                title: <IntlMessages id="newsletter.recipents" />,
                dataIndex: "member_count",
                key: "member_count",
                className: "center-column",
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                className: "center-column",
            },
            {
                title: <IntlMessages id="global.actions" />,
                className: "center-column",
                key:'actions',
                render: (text, record) => {
                    return (
                        <React.Fragment>
                            <Button type="primary" className="mr-4" onClick={() => this.onOpenModalUpdate(record)} disabled={record.id === 0}>
                                <IntlMessages id="global.update" />
                            </Button>
                            <Button type="danger" onClick={() => this.openAlert(record)} disabled={record.id === 0}>
                                <IntlMessages id="global.delete" />
                            </Button>
                        </React.Fragment>
                    )
                }
            },
        ];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectRowChange,
        };

        const columns_registered = [
            {
                key: "image",
                title: <IntlMessages id="global.avatar" />,
                dataIndex: "image",
                render: (text, record) =>
                    record.image ? (
                        <AvatarInTable
                            src={config.url_asset_root + record.image}
                            defaul={record.image === "//logo3.png" ? 1 : 0}
                            title={
                                record.firstname
                                    ? `${record.firstname} ${record.lastname}`
                                    : `user`
                            }
                            alt={`${record.firstname}${record.lastname}`}
                        ></AvatarInTable>
                    ) : (
                            <AvatarInTable
                                src={require('../../assets/img/user.png')}
                                alt={`user`}
                                title={
                                    record.firstname
                                        ? `${record.firstname} ${record.lastname}`
                                        : `user`
                                }
                            ></AvatarInTable>
                        )
            },
            {
                key: "status",
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
                render: (text, record) =>
                    record.email ? (
                        <b
                            style={record.email_verified === 1 ? { color: "blue", cursor: "pointer" } : { color: '#333', cursor: "pointer" }}
                        >
                            {record.email}
                        </b>
                    ) : (
                            <b
                                style={{ color: "blue", cursor: "pointer" }}
                            >
                                {record.social}
                            </b>
                        )
            },
            {
                title: <IntlMessages id="global.mobile" />,
                dataIndex: "mobile",
                key: "mobile",
                render: (text, record) => (
                    <b
                    >
                        <Link to={`/app/customer/${record.id}`}
                            style={record.phone_verified === 1
                                ?
                                { color: "blue", cursor: "pointer" }
                                :
                                { color: '#333', cursor: "pointer" }}>
                            {record.mobile}
                        </Link>

                    </b>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="global.firstname" />,
                dataIndex: "firstname",
                key: "firstname",
                render: (text, record) => (
                    <b>
                        <Link to={`/app/customer/${record.id}`} style={{ color: "blue" }}>
                            {record.firstname}
                        </Link>
                    </b>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="global.lastname" />,
                dataIndex: "lastname",
                key: "lastname",
                render: (text, record) => (
                    <b>
                        <Link to={`/app/customer/${record.id}`} style={{ color: "blue" }}>
                            {record.lastname}
                        </Link>
                    </b>
                ),
                sorter: true
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
                sorter: true
            },
            {
                title: <IntlMessages id="global.lastlogin" />,
                dataIndex: "last_login",
                key: "last_login",
                className: "center-column",
                render: (text, record) =>
                    record.last_login ? (
                        <React.Fragment>
                            <div>{moment(record.last_login).format("DD/MM/YYYY")}</div>
                            <div>{moment(record.last_login).format("HH:mm")}</div>
                        </React.Fragment>
                    ) : (
                            <React.Fragment>
                                <div>{moment(record.updated_at).format("DD/MM/YYYY")}</div>
                                <div>{moment(record.updated_at).format("HH:mm")}</div>
                            </React.Fragment>
                        )
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true
            }
        ]

        let options = this.props.account.listAccountPaging.filter(e => e.email);
        return (
            <React.Fragment>
                <TableActionBar
                    onAdd={() => { this.onOpenModalUpdate(null) }}
                    onRefresh={() => { }}
                    table=""
                    isShowPublishButtons={false}
                    isShowDeleteButton={false}
                    onFilter={(keyword) => this.onSearch(keyword)}
                    textSearch={false}
                >
                </TableActionBar>
                <Table
                    columns={columns}
                    dataSource={[{ id: 0, name: "All Subcriber", member_count: this.props.newsletter.subscribers.length }, ...this.props.newsletter.segments]}
                    rowKey="id"
                    size="small"
                    tableLayout="auto"
                    pagination={false}
                    loading={this.state.loading}
                // rowSelection={rowSelection}
                />

                <Modal
                    title={<IntlMessages id="newsletter.recipents" />}
                    visible={openModalUpdate}
                    onOk={this.state.cItem ? this.onUpdate : this.onAdd}
                    onCancel={this.onCloseModalUpdate}
                    width={'90%'}
                >
                    <div>
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={<span> <Icon type="info" /> <IntlMessages id="global.tabbasic" /></span>}
                                key="1"

                            >
                                {
                                    <div style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: 'column' }}>
                                        <Input placeholder="Segment Name" style={{ width: "70%" }} className="mb-4"
                                            disabled={this.state.cItem ? true : false}
                                            value={this.state.cItem ? this.state.cItem.name : this.state.nameSegment}
                                            onChange={
                                                (e) => {
                                                    this.setState({ nameSegment: e.target.value })
                                                }
                                            } allowClear={true} />
                                    </div>
                                }

                            </TabPane>
                            <TabPane
                                tab={<span> <Icon type="usergroup-add" /><IntlMessages id="newsletter.recipents" /> </span>}
                                key="2"
                            >
                                <RctCollapsibleCard colClasses="col-12">
                                    <TableActionBar
                                        // isDisabled={!hasSelected}
                                        // rows={this.state.selectedRowKeys}
                                        table="customer"
                                        isShowPublishButtons={false}
                                        showFilter={true}
                                        isShowDeleteButton={false}
                                        isShowAddButton={false}
                                        // onFilter={this.filter}
                                        textSearch={false}
                                    >

                                    </TableActionBar>
                                    <Table
                                        rowSelection={rowSelection}
                                        columns={columns_registered}
                                        dataSource={options}
                                        tableLayout="auto"
                                        rowKey="email"
                                        size="small"
                                        pagination={{
                                            pageSize: 20,
                                        }}
                                    // onChange={this.onChangeTable}

                                    // scroll={{ x: 1500 }}
                                    // loading={this.state.loading}
                                    />
                                </RctCollapsibleCard>
                            </TabPane>
                        </Tabs>


                    </div>
                </Modal>
                <RecipentModal isOpen={this.state.openModalRecipients} handleClick={this.onCloseModalRecipient} data={this.props.newsletter.membersSegment} />
            </React.Fragment>

        )
    }

}

const mapStateToProps = (state) => {
    return {
        newsletter: state.newsletter,
        account: state.account,
        config: state.config
    }
}

export default connect(mapStateToProps, {
    getListSegments, getListMembersSegment,
    getListSubscribers, updateMembersSegment,
    addSegment, deleteSegment, getAllAccountWithoutPaging
})(Recipents)