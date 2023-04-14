import React, { useState } from 'react';
import { Table, Button, Modal, Tabs, Spin, Select } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getListAudiences, deleteCampaign, sendCampaign, getListMembers, addListMembers } from '../../actions/NewsletterAction';
import { getAllAccountWithoutPaging } from '../../actions/AccountAction';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import FormCreate from './FormCreate';


const confirm = Modal.confirm;

const { Option } = Select;

function RecipentModal(props) {

    let { data, isOpen, handleClick } = props;
    let columns = [
        {
            title: <IntlMessages id="global.email" />,
            dataIndex: "email_address",
            key: "email_address",
            className: "center-column",
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
            title="Recipents"
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

function FormAddSubcribers(props) {
    let { isOpen, onOk, onCancel, options } = props;
    const [seleted, changeSelected] = useState([]);
    let opts = options.filter(e => e.email)
    return (
        <Modal
            title="Add Subscribers"
            visible={isOpen}
            onOk={() => { onOk(seleted) }}
            onCancel={onCancel}
            width="70%"
        >
            <Select mode="tags" style={{ width: '100%' }} onChange={(list) => { changeSelected(list) }} tokenSeparators={[',']}>
                {
                    opts.map(e => (
                        <Option key={e.email}>{e.email}</Option>
                    ))
                }
            </Select>
        </Modal>
    )
}

class List extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        openModalRecipents: false,
        cItem: null,
        openModalForm: false,
        isLoading: false,
        list: []
    }

    onCloseModalRecipents = () => {
        this.setState({
            openModalRecipents: false,
            cItem: null
        })
    }

    onOpenModalRecipents = (item) => {
        this.setState({
            openModalRecipents: true,
            cItem: item
        })
    }

    onCloseModalForm = () => {
        this.setState({
            openModalForm: false,
        })
    }

    onOpenModalForm = () => {
        this.props.getAllAccountWithoutPaging({}, 'registered');
        this.setState({
            openModalForm: true,
        })
    }

    onAddListMembers = (emails) => {
        this.setState({
            isLoading: true
        })
        this.props.addListMembers(emails).then(data => {
            this.setState({
                isLoading: false,
                openModalForm: false
            })
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        })
    }

    onGetListMembers = (record) => {
        this.setState({
            isLoading: true
        });
        this.props.getListMembers().then((data) => {
            this.setState({
                isLoading: false,
                openModalRecipents: true,
                list: this.props.newsletter.members
            });
        }).catch(err => {
            this.setState({
                isLoading: false
            });
        })

    }
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        this.props.getListAudiences().then(res => {
            this.setState({
                isLoading: false
            })
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        });
    }

    openAlert(item) {
        confirm({
            title: "Bạn có muốn xóa bản ghi này không?",
            okText: 'Có',
            cancelText: 'Huỷ',
            okType: "danger",
            onOk: () => this.onDeleteCampaign(item),
            onCancel() { }
        });
    }

    render() {
        const columns = [
            {
                title: <IntlMessages id="global.title" />,
                // key: '',
                render: (text, record) => {
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { this.onGetListMembers(record) }} >{record.name}</b>
                    )
                }
            },
            {
                title: "Subscribers",
                dataIndex: "stats.member_count",
                key: "stats.member_count"
            },
            {
                title: "Unsubscribers",
                className: "center-column",
                dataIndex: "stats.unsubscribe_count",
                key: "stats.unsubscribe_count"
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                className: "center-column",
                sorter: true
            }
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
                            title={<IntlMessages id="newsletter.list" />}
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

                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.props.newsletter.audiences}
                                    rowKey="id"
                                    size="small"
                                    // pagination={{
                                    //     pageSizeOptions: ["10", "20", "30"],
                                    //     total: paging.count,
                                    //     showSizeChanger: true
                                    // }}
                                    tableLayout="auto"
                                    onChange={this.onChangTable}
                                // scroll={{ x: 1500 }}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </div>

                    <RecipentModal isOpen={this.state.openModalRecipents} handleClick={this.onCloseModalRecipents} data={this.props.newsletter.members} />
                    <FormAddSubcribers isOpen={this.state.openModalForm} onOk={(emails) => { this.onAddListMembers(emails) }} onCancel={this.onCloseModalForm} options={this.props.account.listAccountPaging} />

                </Spin>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newsletter: state.newsletter,
        account: state.account
    }
}

export default connect(mapStateToProps, { getListAudiences, deleteCampaign, sendCampaign, getListMembers, getAllAccountWithoutPaging, addListMembers })(List);