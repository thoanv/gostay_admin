import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { PageHeader, Typography } from 'antd';

/**
 * render function for breadcrumb
 * @param {*} route 
 * @param {*} params 
 * @param {*} routes 
 * @param {*} paths 
 */


class PageTitleBar extends Component {
    render() {
        var { title } = this.props;

        return (
            <PageHeader
                className="site-page-header"
                onBack={() => this.props.history.goBack()}
                title={<Typography.Title level={2}>{title}</Typography.Title>}
            />
        )
    }
}

export default withRouter(PageTitleBar);


