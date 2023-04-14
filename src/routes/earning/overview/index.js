import React, { Component } from 'react'
import { Spin, Card } from 'antd';
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getEarningOverview } from '../../../actions/EarningAction';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import Summary from './Summary';
import { PendingTable, AvailableTable, PaidTable } from './Overview';


class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            current_tab: "PENDING"
        }


    }
    async componentDidMount() {
        try {
            await this.props.getEarningOverview()
            this.setState({
                loading: false
            })
        } catch (error) {
            this.setState({
                loading: false
            })
        }
    }

    onSelectSummary = (status) => {
        this.setState({
            ...this.state,
            current_tab: status
        })
    }

    render() {
        const { listOverview } = this.props
        const { loading, current_tab } = this.state
        var title = "Danh sách đơn hàng chưa được rút"

        if (current_tab == "AVAILABLE") title = "Danh sách đơn hàng đang chờ rút";
        if (current_tab == "PAID") title = "Danh sách đơn hàng đã rút";
        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.overview" />}
                        match={this.props.match}
                    />
                    <Spin spinning={loading}>
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <Summary
                                    listOverview={listOverview}
                                    onSelect={this.onSelectSummary}
                                    current_tab={current_tab}
                                />

                                <div style={{ marginTop: "20px" }}>
                                    <Card title={title}>
                                        <div style={current_tab == "PENDING" ? {} : { display: 'none' }}>
                                            <PendingTable />
                                        </div>
                                        <div style={current_tab == "AVAILABLE" ? {} : { display: 'none' }}>
                                            <AvailableTable />
                                        </div>
                                        <div style={current_tab == "PAID" ? {} : { display: "none" }}>
                                            <PaidTable />
                                        </div>
                                    </Card>
                                </div>

                            </RctCollapsibleCard>
                        </div>
                    </Spin>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listOverview: state.earning.listOverview,
        config: state.config,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getEarningOverview: () => dispatch(getEarningOverview()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Overview));