import React from 'react';
import './style.css';
import { Icon, Checkbox, Modal } from 'antd';
import { del } from '../../actions/FileManagerActions';
import { connect } from 'react-redux';
const confirm = Modal.confirm;

class LargeFolder extends React.Component {

    state = {
        checked: false,
        checkAll: false,
    }

    static defaultProps = {
        item: {},
        checkAll: false,
        indeterminate: false,
        onChange: () => { },
        openFolder: () => { }
    }

    static getDerivedStateFromProps(props, state) {
        //     if (props.checkAll !== state.checkAll) {
        //         if (!props.indeterminate) {
        //             return {
        //                 checkAll: props.checkAll,
        //                 checked: props.checkAll
        //             }
        //         }
        //         else return {
        //             ...state,
        //             checkAll: props.checkAll
        //         }
        //     }
        if (props.checked != state.checked) {
            return {
                ...state,
                checked: props.checked
            }
        }
        return null;
    }

    onChange = e => {
        this.setState({
            ...this.state,
            checked: e.target.checked
        })
        this.props.onChange(this.props.item, e.target.checked);
    }

    openAlert() {
        confirm({
            title: "Bạn có muốn xóa thư mục này không?",
            cancelText: "Huỷ",
            okText: "OK",
            okType: 'danger',
            onOk: () => this.delFolder(),
            onCancel() { },
        })
    }


    delFolder = async () => {
        let item = this.props.item;
        let data = {
            rm: [item.name],
            folder: this.props.folderbase
        }
        this.props.del(data).then(res => {
            window.location.reload();
        })
    }

    render() {
        const { item } = this.props;
        return (
            <div className="large-item">
                <div className="large-item-header">
                    <Checkbox style={{ float: "left", padding: "0px 2px" }} checked={this.state.checked} onChange={this.onChange}></Checkbox>
                    <Icon type="close" className="icon-close-file" onClick={() => this.openAlert()} />
                </div>
                <div className="large-item-body" align="center" onClick={() => this.props.openFolder(item)}>
                    <Icon type="folder" theme="filled" style={{ fontSize: "4em", color: "#3372A7" }} />
                </div>
                <div className="large-item-footer" align="center" onClick={() => this.props.openFolder(item)}>
                    <p>{item.name}</p>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        del: (data) => dispatch(del(data))
    }
}

export default connect(null, mapDispatchToProps)(LargeFolder);