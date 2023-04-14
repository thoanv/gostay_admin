import React from 'react';
import { Button, Icon, Tooltip, message, Modal } from 'antd';
import { _deleteRole } from '../../actions/PermissionAction';
import { connect } from 'react-redux';

const { confirm } = Modal;

class RoleItem extends React.Component {

    static defaultProps = {
        selected: null,
        data: {},
        onChange: () => { }
    }

    deleteIcon = (item) => {
        if (item.id === 1) {
            return null
        }
        return (
            <Tooltip placement="top" title="Xoá">
                <Icon type="delete" style={{ marginLeft: "10px", fontSize: "20px" }} onClick={() => this.showDeleteConfirm(item)} />
            </Tooltip>
        )
    }


    showDeleteConfirm(item) {
        confirm({
            title: 'Bạn có chắc chắn muốn xoá loại tài khoản này?',
            content: <span>Sau khi xoá <b>{item.title}</b>, các tài khoản có chức vụ là <b>{item.title}</b> sẽ không còn quyền truy cập vào các chức năng của <b>{item.title}</b> nữa.</span>,
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: () => { this.onDelete(item.id); Modal.destroyAll(); },
        });
    }

    onDelete(id) {
        const { setLoading, deleteSuccess } = this.props;
        setLoading(true);
        this.props._deleteRole(id).then(res => {
            deleteSuccess();
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }

    render() {

        var { selected, data } = this.props;

        if (data && data.id === 2 || data.id === 5) return null;

        if (selected && selected.id === data.id) return (
            <div style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
                <Button type="primary" block style={{ width: "100%" }} onClick={() => this.props.onChange(null, false)} >{data.title}</Button>
                {this.deleteIcon(data)}
            </div>

        )
        return (
            <Button block style={{ marginBottom: "20px" }} onClick={() => this.props.onChange(data, true)} >{data.title}</Button>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        _deleteRole: (id) => dispatch(_deleteRole(id))
    }
}

export default connect(null, mapDispatchToProps)(RoleItem);