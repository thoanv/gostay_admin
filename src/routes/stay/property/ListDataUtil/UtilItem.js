import React from 'react';
import { Card, Checkbox } from 'antd';


class UtilItem extends React.Component {


    static defaultProps = {
        data: {},
        valueAdd: []
    }


    getCheck(item) {
        let a = this.props.valueAdd.indexOf(item.toString());
        if (a >= 0) return true;
        return false
    }

    render() {

        var { data, onChange } = this.props;

        return (
            <Card title={  data._id}>
                {data.data && data.data.length ? data.data.map(item => {
                    let checked = this.getCheck(item.id);
                    return (
                        <div key={item.id}>
                            <Checkbox
                                onChange={() => onChange(item.id, checked)}
                                checked={checked}
                              
                            >
                                {item.title}
                            </Checkbox>
                        </div>
                    )
                }) : null}

            </Card>
        )
    }
}

export default UtilItem;