import { Button, Modal, Row, Col, Empty, Input, Tooltip, Spin, Icon, message } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { _createNew, _getAll, _update, _getAllPermissionOfRole, _getAllPermissionOfRoleArr, _getAllPermission } from "../../actions/PermissionAction";
import RoleItem from './RoleItem';
import ListPermission from './ListPermission';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";


const PlusCircleOutlined = (props) => (<Icon {...props} type="plus-circle" />)
const MinusCircleOutlined = (props) => (<Icon {...props} type="minus-circle" />)



const success = Modal.success;

class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {

            //edit
            edit: {
                selectedRole: null,
                isEdit: false,
                permission_of_role: [],
                editTitle: "",
                editSlug: ""
            },

            // state add 
            add: {
                isAddNew: false,
                permission_add: [],
                permission_select: [],
                addTitle: "",
                addSlug: ""
            },
            isSubmiting: true,
        };
    }



    async   componentDidMount() {
        try {
            await this.props._getAll();
            await this.props._getAllPermission();
            this.setState({ ...this.state, isSubmiting: false })

        } catch (error) {
            this.setState({ ...this.state, isSubmiting: false });
            message.error("Có lỗi sảy ra")
        }


    }

    onAdd = () => {
        if (!this.state.edit.isEdit)
            this.setState({
                ...this.state,
                add: {
                    ...this.state.add,
                    isAddNew: true
                }
            });
    };


    onEdit(role, edit) {
        let a = this;
        if (!this.state.add.isAddNew) {
            if (role) {
                this.setState({
                    ...this.state,
                    edit: {
                        ...this.state.edit,
                        selectedRole: role,
                        isEdit: edit,
                        editSlug: role.slug,
                        editTitle: role.title
                    },
                    isSubmiting: true

                }, async () => {
                    try {

                        let dataPOR = await a.props._getAllPermissionOfRole(role.id);
                        a.setState({
                            ...a.state,
                            edit: {
                                ...a.state.edit,
                                permission_of_role: [...dataPOR.permission_id_arr],
                            },
                            isSubmiting: false
                        })
                    } catch (error) {
                        console.log(error)
                        a.setState({
                            ...a.state,
                            isSubmiting: false
                        })
                    }
                });
            }
            else {
                this.setState({
                    ...this.state,
                    edit: {
                        selectedRole: role,
                        isEdit: edit,
                        permission_of_role: [],
                        editTitle: "",
                        editSlug: ""

                    }
                });
            }
        }

    }


    onCloseAdd = () => {
        this.setState({
            ...this.state,
            add: {
                isAddNew: false,
                permission_add: [],
                isSubmiting: false,
                addTitle: "",
                addSlug: ""
            }
        });
    };


    onChangePermissionAdd = (data) => {
        this.setState({
            ...this.state,
            add: {
                ...this.state.add,
                permission_add: data
            }
        })
    }


    pushArr(arr, arrPush) {
        let arrP = arrPush.filter(item => arr.indexOf(item) < 0);
        arr.push(...arrP);
        return arr;
    }


    onChangeName = (v, type) => {
        if (type) {
            this.setState({
                ...this.state,
                add: {
                    ...this.state.add,
                    addTitle: v.target.value
                }
            })
        }
        else {
            this.setState({
                ...this.state,
                edit: {
                    ...this.state.add,
                    editTitle: v.target.value
                }
            })
        }
    }

    onChangeSlug = (v, type) => {
        if (type) {
            this.setState({
                ...this.state,
                add: {
                    ...this.state.add,
                    addSlug: v.target.value
                }
            })
        }
        else {
            this.setState({
                ...this.state,
                edit: {
                    ...this.state.add,
                    editSlug: v.target.value
                }
            })
        }
    }

    submitAdd() {
        var { addTitle, addSlug, permission_add } = this.state.add;
        if (!addTitle) {
            return alert("Vui lòng nhập tên loại tài khoản")
        }


        let data = {
            title: addTitle,
            slug: addSlug,
            permissionids: permission_add
        }


        let a = this;
        this.setState({ ...this.state, isSubmiting: true }, () => {
            a.props._createNew(data).then(res => {
                success({
                    content: 'Thêm loại tài khoản thành công.',
                    onOk: () => window.location.reload()
                })
            }).catch(err => a.setState({
                ...a.state,
                isSubmiting: false
            }))
        })
    }



    onChangePermissionEdit = (data) => {
        this.setState({
            ...this.state,
            edit: {
                ...this.state.edit,
                permission_of_role: data
            }
        })
    }

    submitEdit() {
        var { editTitle, editSlug, permission_of_role, selectedRole } = this.state.edit;
        if (!editTitle) {
            return alert("Vui lòng nhập tên loại tài khoản")
        }


        let data = {
            id: selectedRole.id,
            title: editTitle,
            slug: editSlug,
            permissionids: permission_of_role
        }


        let a = this;
        this.setState({ ...this.state, isSubmiting: true }, () => {
            a.props._update(data).then(res => {
                success({
                    content: 'Cập nhật thành công.',
                    onOk: () => window.location.reload()
                })
            }).catch(err => a.setState({
                ...a.state,
                isSubmiting: false
            }))
        })
    }


    render() {
        var { list, allPermission } = this.props;
        var { edit, add, isSubmiting } = this.state;
        var { isEdit, permission_of_role, selectedRole, editTitle, editSlug } = edit;
        var { isAddNew, permission_add, addTitle, addSlug } = add;


        return (
            <div className="formelements-wrapper">
                <PageTitleBar
                    title={"Phân quyền"}
                    match={this.props.match}
                />
                <div className="row">
                    <RctCollapsibleCard colClasses="col-12">

                        <Row gutter={[10]}>
                            <Col span={6} style={{
                                borderRight: "5px solid rgb(240, 242, 245)"
                            }}>
                                <p style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    fontWeight: "500"
                                }} >Danh sách các loại tài khoản&nbsp;
                            {!isAddNew ?
                                        <Tooltip placement="top" title="Thêm loại tài khoản">
                                            <PlusCircleOutlined className="icon-create-role" onClick={() => this.onAdd()} />
                                        </Tooltip>
                                        : <Tooltip placement="top" title="Đóng">
                                            <MinusCircleOutlined className="icon-create-role" onClick={() => this.onCloseAdd()} />
                                        </Tooltip>
                                    }
                                </p>
                                <Spin spinning={isSubmiting}>
                                    {
                                        list && list.length ?
                                            list.map(item => {
                                                return (
                                                    <RoleItem
                                                        data={item}
                                                        key={item.id}
                                                        selected={selectedRole}
                                                        onChange={(i, edit) => this.onEdit(i, edit)}
                                                        setLoading={(loading) => this.setState({ ...this.state, isSubmiting: loading })}
                                                        deleteSuccess={() => this.setState({
                                                            ...this.state,
                                                            edit: {
                                                                selectedRole: role,
                                                                isEdit: edit,
                                                                permission_of_role: [],
                                                                editTitle: "",
                                                                editSlug: ""
                                                            },
                                                            isSubmiting: false
                                                        })}
                                                    />
                                                )
                                            })
                                            : (
                                                <Empty description="Chưa có loại tài khoản" />
                                            )
                                    }
                                </Spin>
                            </Col>
                            <Col span={18}>
                                <p style={{
                                    textAlign: "center",
                                    fontSize: "20px",
                                    fontWeight: "500"
                                }} >Danh sách các chức năng</p>
                                <Spin spinning={isSubmiting}>
                                    {
                                        isAddNew ?
                                            <React.Fragment>
                                                <div style={{ display: "flex", marginBottom: "20px" }} >
                                                    <Input
                                                        placeholder="Loại tài khoản"
                                                        value={addTitle}
                                                        onChange={(v) => this.onChangeName(v, 1)}
                                                        style={{ marginRight: "10px", width: "100%" }}
                                                    ></Input>
                                                    <Button type="primary" className="mr-2" onClick={() => this.submitAdd()}>Thêm</Button>
                                                    <Button onClick={() => this.onCloseAdd()} >Huỷ</Button>
                                                </div>
                                                <ListPermission
                                                    data={allPermission}
                                                    edit={isEdit}
                                                    addNew={isAddNew}
                                                    valueAdd={permission_add}
                                                    onChangePermissionAdd={this.onChangePermissionAdd}
                                                />
                                            </React.Fragment>
                                            : null
                                    }

                                    {
                                        isEdit ?
                                            <React.Fragment>
                                                <div style={{ display: "flex", marginBottom: "20px" }} >
                                                    <Input
                                                        placeholder="Tên tài loại tài khoản"
                                                        value={editTitle}
                                                        onChange={(v) => this.onChangeName(v, 0)}
                                                        style={{ marginRight: "10px", width: "100%" }}
                                                    ></Input>
                                                    <Button type="primary" className="mr-2" onClick={() => this.submitEdit()}>Lưu</Button>
                                                    <Button onClick={() => this.onEdit(null, false)} >Huỷ</Button>
                                                </div>
                                                <ListPermission
                                                    data={allPermission}
                                                    edit={isEdit}
                                                    addNew={isAddNew}
                                                    valueAdd={permission_of_role}
                                                    onChangePermissionAdd={this.onChangePermissionEdit}
                                                />
                                            </React.Fragment>
                                            : null
                                    }

                                    {
                                        !(isAddNew || isEdit) ?
                                            (
                                                <ListPermission
                                                    data={allPermission}
                                                    edit={isEdit}
                                                    addNew={isAddNew}
                                                    valueAdd={permission_add}
                                                    onChangePermissionAdd={this.onChangePermissionAdd}
                                                />
                                            )
                                            : null
                                    }

                                </Spin>
                            </Col>
                        </Row>

                    </RctCollapsibleCard>
                </div>
            </div>
        )
    }
}




const mapStateToProps = state => {
    return {
        list: state.permission.list_role,
        allPermission: state.permission.list_permission,
        permission_of_role: state.permission.permission_of_role.list_id,
        allPermissionId: state.permission.list_permission_id
    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: () => dispatch(_getAll()),
        _getAllPermission: () => dispatch(_getAllPermission()),
        _update: (data) => dispatch(_update(data)),
        _createNew: data => dispatch(_createNew(data)),
        _getAllPermissionOfRole: id => dispatch(_getAllPermissionOfRole(id))

    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Role)
);
