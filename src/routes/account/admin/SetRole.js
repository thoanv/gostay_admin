import { Button, Col, Form, Input, Modal, Row, Radio, Select, Tabs } from "antd";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import { _getAll, _getAllPermissionOfRoleArr, _getAllPermissionNotOfRole, _getAddPermissionUser, _updatePermissionUser, _updateAddPermissionUser } from "../../../actions/PermissionAction";


import ListPermission from "../../grouping/ListPermission";
const { Option } = Select;

const { TabPane } = Tabs;

class SetRole extends Component {

    state = {
        account: null,
        roleids: [],
        add: {
            all: [],
            selected: [],
            all_id: []
        },
        minus: {
            all: [],
            selected: [],
            all_id: []
        }
    };

    componentDidMount() {
        this.props._getAll();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.account != state.account) {
            return {
                ...state,
                account: props.account,
                roleids: props.account && props.account.roles ? props.account.roles.map(item => item.id.toString()) : []
            }
        }
        return null
    }

    async  componentDidUpdate(prevProps, prevState) {
        if (this.state.account && this.state.account != prevState.account) {
            // this.setState({
            //     ...this.state,
            //     firstLoading: true
            // })
            try {
                let dataPermissionOfRoleArr = await _getAllPermissionOfRoleArr({ roleids: this.state.roleids });
                let dataPermissionNotOfRoleArr = await _getAllPermissionNotOfRole({ roleids: this.state.roleids });
                let dataAddPermissionUser = await _getAddPermissionUser(this.state.account.id);
                console.log("dataAddPermissionUser", dataAddPermissionUser);
                console.log("dataPermissionOfRoleArr", dataPermissionOfRoleArr);
                console.log("dataPermissionNotOfRoleArr", dataPermissionNotOfRoleArr);
                let dataSelectedAddId = dataAddPermissionUser.permission_add.map(item => item.id);
                let dataSelectedMinusId = dataAddPermissionUser.permission_minus.map(item => item.id);
                this.setState({
                    ...this.state,
                    firstLoading: false,
                    minus: {
                        all: dataPermissionOfRoleArr.data,
                        selected: [...dataSelectedMinusId],
                        all_id: dataPermissionOfRoleArr.permission_id_arr
                    },
                    add: {
                        all: dataPermissionNotOfRoleArr.data,
                        selected: [...dataSelectedAddId],
                        all_id: dataPermissionNotOfRoleArr.permission_id_arr
                    }
                }, () => console.log("this.state", this.state))
            } catch (error) {
                console.log(error)
                this.setState({
                    ...this.state,
                    firstLoading: false
                })
            }
        }
    }


    handleSubmit = (values) => {
        var account = {
            ...values,
        };

        console.log("statet", values)
        this.props.onSaveAccount(
            account,
            this.props.account ? this.props.account._id : null
        )

        this.setState({
            account: null
        })

    };


    onChangePermissionAdd = (data) => {
        this.setState({
            ...this.state,
            add: {
                ...this.state.add,
                selected: data
            }
        })
    }

    onChangePermissionMinus = (data) => {
        this.setState({
            ...this.state,
            minus: {
                ...this.state.minus,
                selected: data
            }
        })
    }

    onChangeSelect = (value) => {
        this.setState({
            ...this.state,
            roleids: value
        })
    }

    saveRole = () => {
        if (!this.state.account) { return }
        let a = this;
        let data = {
            userid: this.state.account.id,
            roleid: this.state.roleids,
        }
        console.log(data)
        this.setState({
            ...this.state,
            loadingSubmit: true
        }, () => {
            a.props._updatePermissionUser(data).then(res => {
                a.setState({ ...a.state, loadingSubmit: false });
                this.props.updateRoleSuccess(res.data)
            }).catch(err => a.setState({ ...a.state, loadingSubmit: false }))
        })
    }

    submitAddPermission() {
        if (!this.state.account) { return }
        let a = this;
        let data = {
            permissionids: this.state.add.selected,
            type: 1,
            userid: this.state.account.id
        }
        this.setState({
            ...this.state,
            loadingSubmit: true
        }, () => {
            _updateAddPermissionUser(data).then(res => {
                a.setState({ ...a.state, loadingSubmit: false });
                a.props.onClose();
            }).catch(err => a.setState({ ...a.state, loadingSubmit: false }))
        })
    }

    submitMinusPermission() {
        if (!this.state.account) { return }
        let a = this;
        let data = {
            permissionids: this.state.minus.selected,
            type: 2,
            userid: this.state.account.id
        }
        this.setState({
            ...this.state,
            loadingSubmit: true
        }, () => {
            _updateAddPermissionUser(data).then(res => {
                a.setState({ ...a.state, loadingSubmit: false });
                a.props.onClose();
            }).catch(err => a.setState({ ...a.state, loadingSubmit: false }))
        })
    }




    render() {
        const {
            onClose,
            open,
            list
        } = this.props;

        var { add, minus, roleids } = this.state;

        return (
            <Modal
                title={
                    // <IntlMessages id="global.setRole" />
                    "Set Role"
                }
                toggle={onClose}
                visible={open}
                destroyOnClose={true}
                closable={true}
                onCancel={onClose}
                footer={null}
                width="50%"
            >

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Thêm quyền" key="2">
                        <p style={{
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "500"
                        }} >Chọn các chức năng thêm cho user</p>
                        <ListPermission
                            key="add"
                            data={add.all}
                            edit={true}
                            addNew={true}
                            valueAdd={add.selected}
                            onChangePermissionAdd={this.onChangePermissionAdd}
                        />
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type='default'
                                    onClick={() => this.props.onClose()}
                                    loading={this.state.loadingSubmit}
                                >
                                    Huỷ
                                                </Button>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: 8 }}
                                    onClick={() => this.submitAddPermission()}
                                    loading={this.state.loadingSubmit}
                                >
                                    Lưu
                                            </Button>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Bớt quyền" key="3">
                        <p style={{
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "500"
                        }} >Chọn các chức năng bớt cho user</p>
                        <ListPermission
                            key="minus"
                            data={minus.all}
                            edit={true}
                            addNew={true}
                            valueAdd={minus.selected}
                            onChangePermissionAdd={this.onChangePermissionMinus}
                        />
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type='default'
                                    onClick={() => this.props.onClose()}
                                    loading={this.state.loadingSubmit}
                                >
                                    Huỷ
                                            </Button>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: 8 }}
                                    loading={this.state.loadingSubmit}
                                    onClick={() => this.submitMinusPermission()}
                                >
                                    Lưu
                                            </Button>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        list: state.permission.list_role,
        allPermission: state.permission.list_permission,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: () => dispatch(_getAll()),
        _updatePermissionUser: data => dispatch(_updatePermissionUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetRole);
