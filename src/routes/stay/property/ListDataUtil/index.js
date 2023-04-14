import React from 'react';
import { Row, Col, Empty } from 'antd';
import UtilItem from './UtilItem';


class ListDataUtil extends React.Component {

    static defaultProps = {
        data: []
    }

    onChange = (item, checked) => {
        
        let { valueAdd } = this.props;
       
        let a = valueAdd.indexOf(item);
        if ((a == 0 || a) && checked) {
            let newArr = valueAdd.filter(i => i != item);
            this.props.onChangeUtil(newArr)
        }
        else {
            let newArr = [...valueAdd];
            newArr.push(item.toString());
            this.props.onChangeUtil(newArr)
           
        }
    }

  

    render() {

        var { data, valueAdd } = this.props;
       
        return (
            

           
            <Row  gutter={[10, 10]}
            style={{ flexDirection: "row" }}>
                {
                    data && data.length ?
                        data.map(item => {
                            return (
                                <Col span={12} key={item._id} >
                                    <UtilItem
                                        data={item}
                                        valueAdd={valueAdd}
                                        onChange={this.onChange}
                                    />
                                </Col>
                            )
                        })
                        : (
                            <Empty description="Không có dữ liệu" />
                        )
                }
            </Row>
           
        )
    }
}

export default ListDataUtil;