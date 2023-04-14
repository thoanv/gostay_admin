import React from 'react';
import { Row, Col, Empty } from 'antd';
import PermissionItem from './PermissionItem';


class ListPermission extends React.Component {

    static defaultProps = {
        data: []
    }

    onChange = (item, checked) => {
        let { valueAdd } = this.props;
        let a = valueAdd.indexOf(item);
        if ((a == 0 || a) && checked) {
            let newArr = valueAdd.filter(i => i != item);
            this.props.onChangePermissionAdd(newArr)
        }
        else {
            let newArr = [...valueAdd];
            newArr.push(item);
            this.props.onChangePermissionAdd(newArr)
        }
    }

    onChangeAll = (data, checked) => {
        let { permissions } = data;
        if (permissions && permissions.length) {
            let permissions_id = permissions.map(item => item.id);

            if (checked) {
                let { valueAdd } = this.props;
                let newArr = valueAdd.filter(i => permissions_id.indexOf(i) < 0);
                this.props.onChangePermissionAdd(newArr)
            }
            else {
                let { valueAdd } = this.props;
                let newArr = valueAdd.filter(i => permissions_id.indexOf(i) < 0);
                newArr.push(...permissions_id)
                this.props.onChangePermissionAdd(newArr);
            }
        }
    }

    render() {

        var { data, edit, addNew, valueAdd } = this.props;


        return (
            <Row gutter={[10, 10]}>
                {
                    data && data.length ?
                        data.map(item => {
                            return (
                                <Col span={8} key={item._id}>
                                    <PermissionItem
                                        data={item}
                                        valueAdd={valueAdd}
                                        disable={!(edit || addNew)}
                                        onChange={this.onChange}
                                        onChangeCheckAll={this.onChangeAll}
                                    />
                                </Col>
                            )
                        })
                        : (
                            <Col span={24}>
                                <Empty description="Không có dữ liệu" />
                            </Col>
                        )
                }
            </Row>
        )
    }
}

export default ListPermission;