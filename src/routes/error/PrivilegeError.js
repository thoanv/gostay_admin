import React, { Component } from 'react';
import { Result, Button } from 'antd';


export default class PrivilegeError extends Component {

    gotoHome() {
        this.props.history.push("/")
    }

    render() {

        return (
            <div className="full-screen-center">
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền thực hiện chức năng này!"
                />,
            </div>
        )
    }
}
