import React from 'react';
import { Row } from 'antd';
import LargeVideo from './LargeVideo';

class ListLargeVideo extends React.Component {

    static defaultProps = {
        data: [],
        checkAll: false,
        indeterminate: false,
        onChangeChecked: () => { }
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
        }, () => this.props.onChangeChecked('video', arr))
    }

    showItem(data) {
        var checkedPaths = this.state.checkedItem.map(item => item.path);

        return data.map((item, index) => {
            return (
                <LargeVideo
                    // checkAll={this.props.checkAll}
                    checked={checkedPaths.indexOf(item.path) >= 0}
                    key={index} item={item}
                    onChange={this.onChange}
                    folderbase={this.props.folderbase}
                    indeterminate={this.props.indeterminate}
                ></LargeVideo>)
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

export default ListLargeVideo;