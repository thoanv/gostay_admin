import React from 'react';
import './style.css';
import { Icon, Checkbox, Modal } from 'antd';
import { del } from '../../actions/FileManagerActions';
import { connect } from 'react-redux';
import config from '../../../config';
const confirm = Modal.confirm;

class LargeImg extends React.Component {

    state = {
        open: false,
        checked: false,
    }

    static defaultProps = {
        item: {},
        indeterminate: false,
        onChange: () => { }
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.checkAll !== state.checkAll) {
        //     if (!props.indeterminate) {
        //         return {
        //             ...state,
        //             checkAll: props.checkAll,
        //             checked: props.checkAll
        //         }
        //     }
        //     else return {
        //         ...state,
        //         checkAll: props.checkAll
        //     }
        // }

        if (props.checked != state.checked) {
            return {
                ...state,
                checked: props.checked
            }
        }
        return null;
    }

    openModal = () => {
        this.setState({
            open: !this.state.open
        })
    }

    openAlert() {
        confirm({
            title: "Bạn có muốn xóa tệp này không?",
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

    onChange = e => {
        this.setState({
            ...this.state,
            checked: e.target.checked
        })
        this.props.onChange(this.props.item, e.target.checked);
    }

    render() {
        const { item, config } = this.props;

        return (
            <React.Fragment>
                <div className="large-item">
                    <div className="large-item-header">
                        <Checkbox style={{ float: "left", padding: "0px 2px" }} checked={this.state.checked} onChange={this.onChange}></Checkbox>
                        <Icon type="close" className="icon-close-file" onClick={() => this.openAlert()} />
                    </div>
                    <div className="large-item-body" align="center" onClick={this.openModal}>
                        <img
                            // src={`${config.url_asset_root}${item.path_relative}`}
                            src={`${config.url_asset_root}images/${item.path_relative}`}
                            alt="img-thumbnail"
                            style={{ maxHeight: "70px", width: "100%", objectFit: "cover", verticalAlign: "middle" }}
                        ></img>
                    </div>
                    <div className="large-item-footer" align="center" onClick={this.openModal}>
                        <p>{item.name}</p>
                    </div>
                </div>

                <Modal
                    title={item.title}
                    toggle={this.openModal} visible={this.state.open}
                    closable={true}
                    onCancel={this.openModal}
                    footer={null}
                    width="50%"
                >
                    <img
                        // src={`${config.url_asset_root}${item.path_relative}`}
                        src={`${config.url_asset_root}images/${item.path_relative}`}
                        alt="img-thumbnail"
                        style={{ width: "100%", verticalAlign: "middle" }}
                    ></img>
                </Modal>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

function mapDispatchToProps(dispatch) {
    return {
        del: (data) => dispatch(del(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LargeImg);