import React, { Component } from 'react'
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import TableActionBar from "Components/TableActionBar";
import { Table, Modal, Form, Button } from 'antd';
import BaseSelect from "Components/Elements/BaseSelect";
import BaseRadioList from "Components/Elements/BaseRadios";
import moment from 'moment';
// actions
import {
    getAllApiKeys,
    createApiKey,
    deleteApiKeys
} from "../../actions/ApiKeyAction";
import { getAllACCOUNT } from '../../actions/AccountAction';

class ApiKey extends Component {
    state = {
        isShowCreateModal: false,
        selectedRowKeys: [],
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
        type: 'registered'
    }

    componentDidMount() {
        this.props.getAllApiKeys();
        this.props.getAllACCOUNT({}, this.state.type);
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
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
            this.props.getAllApiKeys(this.state.filter);
        }, 300);
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
                this.props.getAllApiKeys(this.state.filter);
            }
        );
    }

    onSearchCustomer(keyword) {
        this.props.getAllACCOUNT({
            title: {
                type: "like",
                value: keyword,
            }
        }, this.state.type);
    }

    onDeleteItems() {
        this.props.deleteApiKeys(this.state.selectedRowKeys);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.createApiKey(values).then(() => {
                    this.props.form.resetFields();
                    this.setState({ isShowCreateModal: false });
                });
            }
        });
    }

    onChangeType(value) {
        this.setState({ type: value });
        this.props.getAllACCOUNT({}, value);
        this.props.form.setFieldsValue({ customer: '' });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        var { keys, paging, customers } = this.props;
        var { selectedRowKeys, isShowCreateModal } = this.state;
console.log(keys)
        const columns = [
            {
                title: <IntlMessages id="global.customer" />,
                key: "email",
                render: (text, record) => (
                    <div>({record.firstname} {record.lastname}) {record.email}</div>
                ),
                dataIndex: "email",
            },
            {
                title: <IntlMessages id="api_key.key" />,
                key: "api_key",
                dataIndex: "api_key",
            },
            {
                title: <IntlMessages id="global.created" />,
                dataIndex: "created_at",
                key: "created_at",
                render: (text, record) => (
                    <div>{moment(record.created_at).format("DD/MM/YYYY HH:mm")}</div>
                ),
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                sorter: true,
            },
        ]

        return (
            <div>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.api_key" />}
                    match={this.props.match}
                />
                <TableActionBar
                    isShowPublishButtons={false}
                    onAdd={() => this.setState({ isShowCreateModal: true })}
                    onDelete={() => this.onDeleteItems()}
                    onFilter={(keyword) => this.onFilter('api_key', keyword, 'like')}
                />
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: this.onSelectChange,
                    }}
                    columns={columns}
                    dataSource={keys}
                    onChange={this.onChangTable}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "30"],
                        total: paging.count,
                        defaultCurrent: paging.page,
                        pageSize: paging.perpage,
                    }}
                    size="small"

                />
                <Modal
                    title={<IntlMessages id="global.create" />}
                    visible={isShowCreateModal}
                    footer={null}
                    onCancel={() => this.setState({isShowCreateModal: false})}
                    width={700}
                >
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        labelAlign="left"
                        onSubmit={(e) => this.handleSubmit(e)}
                    >
                        <Form.Item label={<IntlMessages id="global.type" />}>
                            {getFieldDecorator('type', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ],
                            })(
                                <BaseRadioList
                                    options={[
                                        { id: 'registered', title: 'Registered' },
                                        { id: 'agent', title: 'Agent' },
                                        { id: 'supplier', title: 'Supplier' },
                                        { id: 'passenger', title: 'Passenger' },
                                    ]}
                                    vertical={false}
                                    onChange={(value) => this.onChangeType(value)}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={<IntlMessages id="global.customer" />}>
                            {getFieldDecorator('customer', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ],
                            })(
                                <BaseSelect
                                    options={customers}
                                    optionValue="id"
                                    optionLabel="email"
                                    additionalLabel="firstname"
                                    defaultText="Choose a Customer"
                                    showSearch
                                    // onChange={(value, option) => this.onSelect(value, option)}
                                    onSearch={(value) => this.onSearchCustomer(value)}
                                    style={{ width: '400px', marginBottom: '30px' }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary"><IntlMessages id="global.create" /></Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        keys: state.apiKey.keys,
        paging: state.apiKey.paging,
        customers: state.account.listAccount
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllApiKeys: (filter) => dispatch(getAllApiKeys(filter)),
        createApiKey: (data) => dispatch(createApiKey(data)),
        deleteApiKeys: (ids) => dispatch(deleteApiKeys(ids)),
        getAllACCOUNT: (filter, type) => dispatch(getAllACCOUNT(filter, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'api_key_form' })(ApiKey));
