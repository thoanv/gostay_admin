import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../../fileManager/InputChosseFile";
import { _getAll, _getAllPermissionOfRoleArr, _getAllPermissionNotOfRole, _getAddPermissionUser, _updatePermissionUser, _updateAddPermissionUser } from "../../../actions/PermissionAction";

import ListPermission from "../../grouping/ListPermission";
const { Option } = Select;

const { TabPane } = Tabs;


class AddAdmin extends Component {
    static propTypes = {
        account: PropTypes.object,
        onSaveAccount: PropTypes.func,
        open: PropTypes.bool,
        onAccountClose: PropTypes.func
    };

    static defaultProps = {
        account: {
            roleid: []
        },
        edit: false,
        open: false
    };

    state = {
        roleid: [],
        account: null,
        image: ""
    };

    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };
    componentDidMount() {
        this.props._getAll();
        this.setState({
            ...this.state,
            account: this.props.account
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.account !== state.account) {
            return {
                ...state,
                account: props.account,
                roleids: props.account && props.account.roles ? props.account.roles.map(item => item.id.toString()) : []
            };
        }
        return null;
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.account && this.state.account != prevState.account) {
            // this.setState({
            //     ...this.state,
            //     firstLoading: true
            // })
            try {
                let dataPermissionOfRoleArr = await _getAllPermissionOfRoleArr({ roleids: this.state.roleids });
                let dataPermissionNotOfRoleArr = await _getAllPermissionNotOfRole({ roleids: this.state.roleids });
                let dataAddPermissionUser = await _getAddPermissionUser(this.state.account.id);
                this.setState({
                    ...this.state,
                    firstLoading: false,
                    minus: {
                        all: dataPermissionOfRoleArr.data,
                        selected: [...dataAddPermissionUser.permission_minus],
                        all_id: dataPermissionOfRoleArr.permission_id_arr
                    },
                    add: {
                        all: dataPermissionNotOfRoleArr.data,
                        selected: [...dataAddPermissionUser.permission_add],
                        all_id: dataPermissionNotOfRoleArr.permission_id_arr
                    }
                })
            } catch (error) {
                console.log(error)
                this.setState({
                    ...this.state,
                    firstLoading: false
                })
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var account = {
                    ...values,
                    image: this.state.image
                };
                if (!account.password) {
                    delete account.password
                }
                this.props.onSaveAccount(
                    account,
                    this.props.account ? this.props.account.id : null
                ).then(res => this.setState({
                    image: ""
                }))
            }
        });
    };

    render() {
        const { onAccountClose, open, account, edit, list } = this.props;
        const { getFieldDecorator } = this.props.form;
        const dedfaultImage = account
            ? account.image
                ? [{ name: account.image, path_relative: account.image }]
                : []
            : [];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };
        return (
            <React.Fragment>
                {open ? (
                    <Modal
                        title={
                            edit ? (
                                <IntlMessages id="global.edit" />
                            ) : (
                                    <IntlMessages id="global.create" />
                                )
                        }
                        toggle={onAccountClose}
                        visible={open}
                        destroyOnClose={true}
                        closable={true}
                        onCancel={this.props.onAccountClose}
                        footer={null}
                        width="50%"
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label={<IntlMessages id="global.email" />}>
                                {getFieldDecorator("email", {
                                    rules: [
                                        {
                                            type: "email",
                                            message: "The input is not valid E-mail!"
                                        },
                                        {
                                            required: true,
                                            message: "Please input your E-mail!"
                                        }
                                    ],
                                    initialValue: account ? account.email || "" : ""
                                })(<Input />)}
                            </Form.Item>

                            <Form.Item
                                label={<IntlMessages id="global.password" />}
                                hasFeedback
                            >
                                {getFieldDecorator("password", {
                                    rules: [
                                        {
                                            required: edit ? false : true,
                                            message: "Please input your password!"
                                        },
                                        {
                                            validator: this.validateToNextPassword
                                        }
                                    ],

                                })(<Input.Password />)}
                            </Form.Item>


                            <Form.Item label={<IntlMessages id="global.firstname" />}>
                                {getFieldDecorator("firstname", {
                                    rules: [
                                        { required: true, message: "Please input your firstname!" }
                                    ],
                                    initialValue: account ? account.firstname || "" : ""
                                })(<Input style={{ width: "100%" }} />)}
                            </Form.Item>

                            <Form.Item label={<IntlMessages id="global.lastname" />}>
                                {getFieldDecorator("lastname", {
                                    rules: [
                                        { required: true, message: "Please input your last name !" }
                                    ],
                                    initialValue: account ? account.lastname || "" : ""
                                })(<Input style={{ width: "100%" }} />)}
                            </Form.Item>

                            <Form.Item label={<IntlMessages id="global.mobile" />}>
                                {getFieldDecorator("mobile", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input your phone number!"
                                        }
                                    ],
                                    initialValue: account ? account.mobile || "" : ""
                                })(<InputNumber style={{ width: "100%" }} />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.company" />}>
                                {getFieldDecorator("company", {
                                    rules: [{ required: true, message: "Please input Company!" }],
                                    initialValue: account ? account.company || "" : ""
                                })(<Input style={{ width: "100%" }} />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.avatar" />}>
                                <InputChosseFile
                                    onChange={this.getValueChosseFile}
                                    limit={1}
                                    defautValue={dedfaultImage}
                                ></InputChosseFile>
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.roles" />}>
                                {getFieldDecorator("roleids", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please choose role!"
                                        }
                                    ],
                                    initialValue: this.state.roleids
                                })(
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Chọn loại chức vụ"
                                        showSearch={true}
                                        allowClear={true}
                                        mode="multiple"
                                    >
                                        {list && list.length ?
                                            list.map(item => {
                                                if (item && item.id === 2 || item.id === 5) return null;
                                                return (
                                                    <Option key={item.id} value={item.id.toString()}>{item.title}</Option>
                                                )
                                            })
                                            : null
                                        }

                                    </Select>
                                )}
                            </Form.Item>


                            <Row>
                                <Col span={24} style={{ textAlign: "right" }}>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        type='default'
                                        onClick={() => this.props.onAccountClose()}
                                    >
                                        <IntlMessages id="global.cancel" />
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ marginLeft: 8 }}
                                        htmlType="submit"
                                        loading={this.props.loading}
                                    >
                                        <IntlMessages id="global.submit" />
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                ) : null}
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        list: state.permission.list_role,
    };
};
function mapDispatchToProps(dispatch) {
    return {
        _getAll: () => dispatch(_getAll()),
    };
}

export default Form.create({ name: "horizontal_login" })(
    connect(mapStateToProps, mapDispatchToProps)(AddAdmin)
);

//export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormCreateAdmin));
