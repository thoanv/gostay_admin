import React, { Component } from 'react';
import { Typography, Result, Button } from 'antd';
import { withRouter } from 'react-router-dom';


class NotFoundPage extends Component {

    gotoHome() {
        this.props.history.push("/")
    }

    render() {
        return (
            <div className="full-screen-center">
                <Result
                    status="404"
                    title="404"
                    subTitle="Page not found"
                    extra={<Button type="primary" onClick={() => this.gotoHome()} >Go back to the home page</Button>}
                />,
            </div>
        )
    }
}

export default withRouter(NotFoundPage);
