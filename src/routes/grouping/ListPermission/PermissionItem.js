import React from 'react';
import { Card, Checkbox } from 'antd';
import IntlMessages from "Util/IntlMessages";

class PermissionItem extends React.Component {


    static defaultProps = {
        data: {},
        valueAdd: []
    }


    getCheck(item) {
        let a = this.props.valueAdd.indexOf(item);
        if (a >= 0) return true;
        return false
    }

    getCheckAll(data) {
        let { permissions } = data;
        if (permissions && permissions.length) {
            for (let i = 0; i < permissions.length; i++) {
                let item = permissions[i];
                let a = this.props.valueAdd.indexOf(item.id);
                if (a < 0) return false;
            }
            return true;
        }
        return false;
    }

    getIndeterminate(data) {
        let { permissions } = data;
        if (permissions && permissions.length) {
            let s = 0;
            for (let i = 0; i < permissions.length; i++) {
                let item = permissions[i];
                let a = this.props.valueAdd.indexOf(item.id);
                if (a >= 0) s = s + 1;
            }
            if (s == permissions.length || s == 0) return false;
            return true
        }
        return false;
    }

    onCheckAllChange = () => {
        let checked = this.getCheckAll(this.props.data);
        this.props.onChangeCheckAll(this.props.data, checked);
    }


    render() {

        var { data, onChange, disable } = this.props;

        return (
            <Card title={<Checkbox
                indeterminate={this.getIndeterminate(data)}
                onChange={this.onCheckAllChange}
                checked={this.getCheckAll(data)}
                disabled={disable}
            >{<IntlMessages id={data._id} />}</Checkbox>}
                style={{ height: "100%", marginBottom: "0px" }}
            >
                {data.permissions && data.permissions.length ? data.permissions.map(item => {
                    console.log(item)
                    let checked = this.getCheck(item.id);
                    return (
                        <div key={item.id}>
                            <Checkbox
                                onChange={() => onChange(item.id, checked)}
                                checked={checked}
                                disabled={disable}
                            >
                                <IntlMessages id={item.name} />
                            </Checkbox>
                        </div>
                    )
                }) : null}

            </Card>
        )
    }
}

export default PermissionItem;