import React from 'react';
import { Row } from 'antd';
import LargFolder from './LargFolder';

class ListLargeFolder extends React.Component {

    static defaultProps = {
        data: [],
        checkAll: false,
        onChangeChecked: () => { },
        openFolder: () => { },
        indeterminate: false
    }

    state = {
        checkedItem: [],
        checkAll: false
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.checkAll !== state.checkAll) {
        //     if (props.indeterminate === false) {
        //         return {
        //             ...state,
        //             checkAll: props.checkAll,
        //             checkedItem: props.checkAll ? props.data : []
        //         }
        //     }
        //     else return {
        //         ...state,
        //         checkAll: props.checkAll
        //     }
        // }

        if (!props.checkedItem) {
            return {
                ...state,
                checkAll: props.checkAll,
                checkedItem: []
            }
        } else {
            if (props.checkedItem.length != state.checkedItem.length) {
                return {
                    ...state,
                    checkAll: props.checkAll,
                    checkedItem: props.checkedItem
                }
            }
        }
        return null;
    }

    onChange = (item, checked) => {
        var arr = [...this.state.checkedItem];
        if (checked) {
            arr.push(item);
        }
        else arr = arr.filter(e => e.name !== item.name);
        this.setState({
            ...this.state,
            checkedItem: arr
        }, () => this.props.onChangeChecked('folder', arr))
    }

    showItem(data) {
        var checkedPaths = this.state.checkedItem.map(item => item.path);

        return data.map((item, index) => {
            return (
                <LargFolder
                    // checkAll={this.props.checkAll}
                    checked={checkedPaths.indexOf(item.path) >= 0}
                    key={index} item={item}
                    onChange={this.onChange}
                    openFolder={() => this.props.openFolder(item)}
                    folderbase={this.props.folderbase}
                    indeterminate={this.props.indeterminate}
                ></LargFolder>)
        })
    }

    render() {
        const { data } = this.props;
        return (
            <Row type="flex" justify="start" align="middle">
                {this.showItem(data)}
            </Row>
        )
    }
}

export default ListLargeFolder;